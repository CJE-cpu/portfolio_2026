# Contact 이메일 설정

Contact 폼은 `@emailjs/browser`로 전송합니다.

1. EmailJS에서 메일 서비스를 연결합니다.
2. 템플릿의 To Email을 `jthe2817@naver.com`으로 고정합니다.
3. Reply-To를 `{{reply_to}}`로 설정합니다. From Email은 연결한 서비스의 인증된 발신 주소를 사용합니다.
4. 템플릿 제목은 `포트폴리오 문의 — {{name}}`로 설정합니다.
5. 본문에 아래 변수를 넣습니다.

```text
이름: {{name}}
답장 주소: {{email}}

{{message}}
```

루트 `.env`에 다음 공개 클라이언트 설정을 넣습니다. 기존 로컬 설정의 변수명은 Vite 형식으로 변경했습니다.

```dotenv
VITE_EMAILJS_SERVICE_ID=서비스_ID
VITE_EMAILJS_TEMPLATE_ID=템플릿_ID
VITE_EMAILJS_PUBLIC_KEY=공개_키
```

VITE 변수는 브라우저 번들에 포함됩니다. 비공개 API 키나 메일 계정 비밀번호를 넣지 마세요.
EmailJS의 허용 도메인에 실제 사이트 주소를 등록하세요.

환경 변수를 변경하면 개발 서버를 재시작합니다. 배포 환경에도 같은 변수를 등록하고 다시 빌드해야 합니다.
설정이 없는 경우 폼 전송 버튼이 비활성화되고 직접 이메일 링크가 표시됩니다.

전송 성공 시 입력을 초기화하고, 실패 시 입력을 유지합니다.
실제 전송 및 메일 수신 여부는 별도로 확인해야 합니다.
