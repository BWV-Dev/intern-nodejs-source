export const labels = {
  FIRST: '先頭',
  LAST: '最終',
  NEXT: '次へ',
  PREVIOUS: '前へ',
};

export const messageTypes = {
  error: 'error',
  info: 'info',
  success: 'success',
};

export const titleMessageError = {
  NOT_FOUND: 'TITLE NOT FOUND',
  INTERNAL_SERVER_ERROR: 'ページエラー',
  FORBIDDEN: '権限エラー',
};

export interface IMessage {
  // tslint:disable-next-line:no-reserved-keywords
  type: string;
  content: string;
}

export const valueLst = {
  // 無効化フラグ
  disableFlgs: {
    0: '有効',
    1: '無効',
  },
};

export const messages = {
  CSVDefault:'フォーマットのヘッダーに不必要なデータもしくは項目名の書き換えがございますとエラーになりますのでご注意ください。',
  ECL001: (column: string) => `${column}は必須項目です。`,
  FORBIDDEN: `アクセス権限がありません。<br/> 大変お手数ですが、システム管理者までご連絡ください。`,
  INTERNAL_SERVER_ERROR: `申し訳ございません。<br/> お客様がアクセスしようとしたページが見つかりませんでした。<br/>
  サイト更新などによってURLが変更になったか、URLが正しく入力されていない可能性があります。<br/>
  ブラウザの再読込を行ってもこのページが表示される場合は、システム管理者にご連絡ください。`,
  ECL034: (param: string) => `${param}に不正な値が入力または選択されています。`,
  API_SELECT_ERROR: (code: string) => `該当の情報が存在しません。(APIレスポンス：<${code}>)`,
  API_UPDATE_ERROR: (code: string) => `サーバーエラーが発生しました。データをご確認の上、再度登録をお願いいたします。(APIレスポンス：<${code}>)`,
  ECL054: 'CSV作成処理の呼び出しに失敗しました。',
  NOT_FOUND: 'NOT FOUND',
  BAD_REQUEST: 'BAD REQUEST',
  ECL056: 'セッションにデータが存在しません。',
  ECL057: 'データの登録に失敗しました。',
  EBT001: (params: string) => `${params}は必須です。`,
  EBT002: ($1: string, $2: string | number, $3: number) => `${$1}は「${$2}」文字以下で入力してください。（現在${$3}文字）`,
  EBT004: (params: string) => `${params}は半角英数で入力してください。`,
  EBT005: 'メールアドレスを正しく入力してください。',
  EBT008: (params: string) => `${params}は日付を正しく入力してください。`,
  EBT010: (params: string) => `${params}は数字を正しく入力してください。`,
  EBT016: 'メールアドレスまたは会員IDが間違っています。',
  EBT019: 'すでにメールアドレスは登録されています。',
  EBT023: 'パスワードは半角英数字記号で8～20文字で入力してください。',
  EBT025: 'パスワードには半角数字のみ、または半角英字のみの値は使用できません。',
  EBT030: '確認用のパスワードが間違っています。',
  EBT036: (params: string) => `${params}が取得できませんでした。`,
  EBT044: '解約予定日は契約終了日前を指定してください。',
  EBT086: 'すでに証明書番号は登録されています。',
  EBT090: '変更がありません  ',
  EBT092 : 'インポートできました。  ',
  EBT094: (params: string) => `${params}が存在しておりません。`,
  EBT095: 'インポートファイルの中身が正しくありません。',
  EBT096: '登録・更新・削除処理に成功しました。',
  EBT098: 'システムエラーになります。',
  ErrorImport: ($1: string | number, $2: string) => `Dòng ${$1}:${$2}`
};

export const position = [
  {id: 1, name: 'Director'},
  {id: 2, name: 'Group Leader'},
  {id: 3, name: 'Leader'},
  {id: 4, name: 'Member'},
];
