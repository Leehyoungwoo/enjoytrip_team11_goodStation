package com.enjoytrip.board.model.service;

import com.enjoytrip.board.model.dto.BoardWritingDto;

import java.sql.SQLException;

public interface BoardService {

    int writeBoard(BoardWritingDto boardWritingDto);
}
