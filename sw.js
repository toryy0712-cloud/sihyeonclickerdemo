// 앱 설치를 허락받기 위한 최소한의 서비스 워커 코드입니다.
self.addEventListener('install', (event) => {
    console.log('[Service Worker] 설치 완료');
});

self.addEventListener('fetch', (event) => {
    // 오프라인 캐싱 등 복잡한 기능은 일단 비워둡니다.
});