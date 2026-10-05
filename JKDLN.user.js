// ==UserScript==
// @name         DCinside Link Normalizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  디시인사이드 글 링크 파라미터를 정제하여 페이지/목록 설정이 달라져도 방문한 글을 보라색으로 표시합니다.
// @author       JKAKK
// @match        https://gall.dcinside.com/*
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/junsarakill/jk-dcinside-link-normalizer/main/JKDLN.user.js
// @downloadURL  https://raw.githubusercontent.com/junsarakill/jk-dcinside-link-normalizer/main/JKDLN.user.js
// @grant        none
// ==/UserScript==

(function()
{
    'use strict';

    // 1. 현재 접속한 글 페이지의 주소창 URL 정제 (방문 기록 통일)
    function normalizeCurURL()
    {
        try
        {
            const url = new URL(window.location.href);

            // 글 보기 페이지인 경우
            if (url.pathname.includes('board/view'))
            {
                const id = url.searchParams.get('id');
                const no = url.searchParams.get('no');

                if (id && no)
                {
                    const cleanUrl = `${url.origin}${url.pathname}?id=${id}&no=${no}`;

                    // 현재 주소창의 URL 및 히스토리 기록을 파라미터가 없는 주소로 교체
                    if (window.location.href !== cleanUrl)
                    {
                        history.replaceState(null, '', cleanUrl);
                    }
                }
            }
        }
        catch (e)
        {
            // 예외 처리
        }
    }

    // 2. 게시글 목록 링크 정제 함수
    function normalizeLinks()
    {
        // 게시글 보기 링크 선택
        const links = document.querySelectorAll('a[href*="board/view"]');

        links.forEach(link =>
        {
            const rawHref = link.getAttribute('href');

            // 유효한 링크인 경우
            if (rawHref)
            {
                try
                {
                    const url = new URL(link.href);
                    const id = url.searchParams.get('id');
                    const no = url.searchParams.get('no');

                    // id와 no 파라미터만 추출하여 주소 단순화
                    if (id && no)
                    {
                        link.href = `${url.pathname}?id=${id}&no=${no}`;
                    }
                }
                catch (e)
                {
                    // URL 파싱 에러 예외 처리
                }
            }
        });
    }

    // 실행
    normalizeCurURL();
    normalizeLinks();

    // 동적 로딩(무한 스크롤 등) 대응을 위한 관찰자 설정
    const observer = new MutationObserver(() =>
    {
        normalizeLinks();
    });

    // 문서 변경 감지 시작
    observer.observe(document.body, { childList: true, subtree: true });
})();