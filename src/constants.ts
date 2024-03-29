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
  CSVDefault:
    'フォーマットのヘッダーに不必要なデータもしくは項目名の書き換えがございますとエラーになりますのでご注意ください。',
  ECL001: (column: string) => `${column}は必須項目です。`,
  ECL002: (
    column: string,
    maxLength: string | number,
    currentLength: string | number,
  ) =>
    `${column}は「${maxLength}」文字以下で入力してください。（現在${currentLength}文字）`,
  ECL004: (column: string) => `${column}は半角英数で入力してください。`,
  ECL005: `メールアドレスを正しく入力してください。`,
  ECL010: (column: string) => `${column}は数字を正しく入力してください。`,
  ECL023: `パスワードは半角英数字記号で8～20文字で入力してください。`,
  ECL030: `確認用のパスワードが間違っています。`,
  ICL050: `該当する情報がありませんでした。`,
  ECL069: (dateFrom: string, dateTo: string) =>
    `入力値が正しくありません。${dateFrom}FROMより${dateTo}TOが大きくなるよう入力してください。`,
  ECL016: `会員IDまたはメールアドレスが間違っています。`,
  FORBIDDEN: `アクセス権限がありません。<br/> 大変お手数ですが、システム管理者までご連絡ください。`,
  INTERNAL_SERVER_ERROR: `申し訳ございません。<br/> お客様がアクセスしようとしたページが見つかりませんでした。<br/>
  サイト更新などによってURLが変更になったか、URLが正しく入力されていない可能性があります。<br/>
  ブラウザの再読込を行ってもこのページが表示される場合は、システム管理者にご連絡ください。`,
  ECL034: (param: string) => `${param}に不正な値が入力または選択されています。`,
  API_SELECT_ERROR: (code: string) =>
    `該当の情報が存在しません。(APIレスポンス：<${code}>)`,
  API_UPDATE_ERROR: (code: string) =>
    `サーバーエラーが発生しました。データをご確認の上、再度登録をお願いいたします。(APIレスポンス：<${code}>)`,
  ECL054: 'CSV作成処理の呼び出しに失敗しました。',
  NOT_FOUND: 'NOT FOUND',
  BAD_REQUEST: 'BAD REQUEST',
  ECL056: 'セッションにデータが存在しません。',
  ECL057: 'データの登録に失敗しました。',
  ECL094: (column: string) => `${column}が存在しておりません。`,
  ECL095: `インポートファイルの中身が正しくありません。`,
};

export enum Status {
  NO = 0,
  YES = 1,
}
