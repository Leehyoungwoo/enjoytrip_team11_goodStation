import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {defineStore} from "pinia";
import {jwtDecode} from "jwt-decode";

import {userConfirm, findById, logout} from "@/api/memberApi";
import {httpStatusCode} from "@/util/http-status";

export const useMemberStore = defineStore("memberStore", () => {
    const router = useRouter();

    const isLogin = ref(false);
    const isLoginError = ref(false);
    const userInfo = ref(null);
    const isValidToken = ref(false);
    onMounted(() => {
        const storedAccessToken = sessionStorage.getItem("accessToken");

        if (storedAccessToken) {
            isValidToken.value = true;
            getUserInfo(storedAccessToken);
            if(isValidToken){
                isLogin.value = true;
                isLoginError.value = false;
            }else{
                isLogin.value = false;
                isLoginError.value = true;
            }
        }
    });
    const userLogin = async (loginUser) => {
        // console.log("userLogin");
        await userConfirm(
            loginUser,
            (response) => {
                // console.log("memberjs , userLogin : " + response.data.data.token);
                if (response.status === httpStatusCode.CREATE) {
                    // let {data} = response;
                    // console.log("memberjs , userLogin : " + data);
                    let accessToken = response.data.data.token;
                    // console.log("accessToken : " + accessToken);
                    // let refreshToken = data["refresh-token"];
                    isLogin.value = true;
                    isLoginError.value = false;
                    isValidToken.value = true;
                    sessionStorage.setItem("accessToken", accessToken);
                    // sessionStorage.setItem("refreshToken", refreshToken);
                } else {
                    console.log("FAIL!!!!!!!");
                    isLogin.value = false;
                    isLoginError.value = true;
                    isValidToken.value = false;
                }
            },
            (error) => {
                console.error(error);
            }
        );
    };

    const getUserInfo = (token) => {
        // console.log(token);
        let decodeToken = jwtDecode(token);
        findById(
            decodeToken.sub,
            (response) => {
                if (response.status === httpStatusCode.OK) {
                    // console.log("member.js의 getUserInfo까지옴!!!")
                    userInfo.value = response.data.data.memberInfo;
                    console.log("로그인 유저 정보 : " + userInfo.value.memberId);
                    console.log("로그인 유저 정보 : " + userInfo.value.name);
                    console.log("로그인 유저 정보 : " + userInfo.value.role);
                    console.log("로그인 유저 정보 : " + userInfo.value.email);
                    console.log("로그인 유저 정보 : " + userInfo.value.nickname);
                } else {
                    console.log("유저 정보 없음!!!!");
                    isValidToken.value = false;
                }
            },
            async (error) => {
                console.error(
                    "getUserInfo() error code [토큰 만료되어 사용 불가능.] ::: ",
                    error.response.status
                );
                isValidToken.value = false;

                // await tokenRegenerate();
            }
        );
    };

    // const tokenRegenerate = async () => {
    //   await tokenRegeneration(
    //       JSON.stringify(userInfo.value),
    //       (response) => {
    //         if (response.status === httpStatusCode.CREATE) {
    //           let accessToken = response.data["access-token"];
    //           sessionStorage.setItem("accessToken", accessToken);
    //           isValidToken.value = true;
    //         }
    //       },
    //       async (error) => {
    //         // HttpStatus.UNAUTHORIZE(401) : RefreshToken 기간 만료 >> 다시 로그인!!!!
    //         if (error.response.status === httpStatusCode.UNAUTHORIZED) {
    //           // 다시 로그인 전 DB에 저장된 RefreshToken 제거.
    //           await logout(
    //               userInfo.value.userid,
    //               (response) => {
    //                 if (response.status === httpStatusCode.OK) {
    //                   console.log("리프레시 토큰 제거 성공");
    //                 } else {
    //                   console.log("리프레시 토큰 제거 실패");
    //                 }
    //                 alert("RefreshToken 기간 만료!!! 다시 로그인해 주세요.");
    //                 isLogin.value = false;
    //                 userInfo.value = null;
    //                 isValidToken.value = false;
    //                 router.push({ name: "user-login" });
    //               },
    //               (error) => {
    //                 console.error(error);
    //                 isLogin.value = false;
    //                 userInfo.value = null;
    //               }
    //           );
    //         }
    //       }
    //   );
    // };

    // const userLogout = async (userid) => {
    // await logout(
    //     userid,
    //     (response) => {
    //         if (response.status === httpStatusCode.OK) {
    //             isLogin.value = false;
    //             userInfo.value = null;
    //             isValidToken.value = false;
    //         } else {
    //             console.error("유저 정보 없음!!!!");
    //         }
    //     },
    //     (error) => {
    //         console.log(error);
    //     }
    // );

    // };


    const userLogout = async () => {
        // await logout(
        //     userid,
        //     (response) => {
        //         if (response.status === httpStatusCode.OK) {
        //             isLogin.value = false;
        //             userInfo.value = null;
        //             isValidToken.value = false;
        //         } else {
        //             console.error("유저 정보 없음!!!!");
        //         }
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );
        isLogin.value = false;
        userInfo.value = null;
        isValidToken.value = false;
        // console.log("로그아웃 완료!!");
    };


    return {
        isLogin,
        isLoginError,
        userInfo,
        isValidToken,
        userLogin,
        getUserInfo,
        // tokenRegenerate,
        userLogout,
    };
});