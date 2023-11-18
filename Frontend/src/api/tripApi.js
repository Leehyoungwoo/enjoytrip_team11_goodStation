import { localAxios } from "@/util/http-commons";

const local = localAxios();

async function insertTrip(param, success, fail) {
    local.defaults.headers["X-AUTH-TOKEN"] = sessionStorage.getItem("accessToken");
    await local.post(`/trip/new`,param).then(success).catch(fail);
}

export { insertTrip};
