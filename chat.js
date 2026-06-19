// 파일 위치: api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '허용되지 않은 요청입니다.' });
    }

    const { message } = req.body;
    // Vercel 환경변수에서 키를 몰래 가져옴
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: '서버에 API 키가 설정되지 않았습니다. Vercel 환경변수를 확인하세요.' });
    }

    // AI에게 내릴 지시사항 (서버에 숨겨둠)
    const prompt = `너는 "sihyeonclickerdemo.vercel.app" 사이트에서 호스팅되는 "이시현의 제과점 (시현클리커 v3.3V)" 게임의 공식 AI 가이드야.
    사용자가 이 게임의 룰(클릭, 상점, 아이템, 랭킹, 환생, 도박, 레이드 보스 등)이나 이 사이트(sihyeonclickerdemo.vercel.app)에 관련된 질문을 하면 친절하게 답변해줘.
    만약 게임이나 이 사이트와 전혀 관련 없는 질문(예: 날씨, 수학, 일반 지식, 타 게임 등)을 하면 무조건 "저는 시현클리커 게임 및 해당 사이트 관련 질문에만 답변할 수 있습니다." 라고 정중히 거절해.
    
    유저의 질문: ${message}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: 'AI 응답을 생성하지 못했습니다.' });
        }
    } catch (error) {
        res.status(500).json({ error: '구글 API 통신 중 오류가 발생했습니다.' });
    }
}