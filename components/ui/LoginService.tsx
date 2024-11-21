// LoginService.ts
const googleUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
const redirectUrl = 'http://kbookmark.co.kr'; // 실제 Google Cloud Console에 등록한 리디렉션 URL로 변경
const clientId = '227716410232-dkede9udod9f1vs33tbk6g360dmpegv6.apps.googleusercontent.com'; // 실제 Client ID로 변경

export const clickSignUp = () => {
    // 파라미터 추가
    const params = new URLSearchParams({
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        access_type: 'online',
        include_granted_scopes: 'true',
        response_type: 'code',
        redirect_uri: redirectUrl,
        client_id: clientId,
    });

    const googleOAuthUrl = googleUrl + '?' + params.toString();
    window.location.href = googleOAuthUrl;
};

export const fetchAuthCode = async (onStateChange: (isAuthenticated: boolean, userId: number | null) => void) => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code'); // 리디렉션 URL에서 코드 추출

    if (authCode) {
        const callBackUrl = "https://kbookmark.co.kr/api/user/google/callback";
        // const param = new URLSearchParams({ code: authCode });
        const response = await fetch(`${callBackUrl}?code=${authCode}`);
        
        if (response.ok) {
            // window.location.href = window.location.origin;
            const data = await response.json();
            console.log(data);
            const userId = Number(data.id)
            if(userId != undefined) {
                onStateChange(true,  userId);
                localStorage.setItem("token", data.accessToken);
                localStorage.setItem("userId", String(userId));
            }
            // 성공적으로 로그인하면 상태 업데이트
            
        } else {
            console.error('Authentication failed');
            onStateChange(false, null);
        }
    }
};
