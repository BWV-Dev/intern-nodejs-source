/************ VALUE LIST ***************/
const valueLst = {
  // 無効化フラグ
  disableFlgs: {
      0: '有効',
      1: '無効'
  },
}

/************ REGEX LIST ***************/
export const regexList = {
  PASSWORD: /^[a-z0-9]+$/,
  EMAIL: /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i,
  HALFWIDTH: /^[\u0020-\u007E\uFF61-\uFF9F]+$/,
  DATE_YYYYMMDD: /^\d{4}\/\d{2}\/\d{2}$/,
}

/************ MESSAGE LIST ***************/

export const messages = {
  ECL001: (column) => `${column}は必須項目です。`,
  ECL002: (column, maxLength, currentLength) => `${column}は「${maxLength}」文字以下で入力してください。（現在${currentLength}文字）`,
  ECL004: (column) => `${column}は半角英数で入力してください。`,
  ECL005: `メールアドレスを正しく入力してください。`,
  ECL008: (column) => `${column}は日付を正しく入力してください。`,
  ECL023: `パスワードは半角英数字記号で8～20文字で入力してください。`,
  ECL030: `確認用のパスワードが間違っています。`,
  ECL069: (from, to) => `入力値が正しくありません。${from}より${to}が大きくなるよう入力してください。`,
  ECL086: `すでに証明書番号は登録されています。`,
  ECL093: `登録・更新・削除処理に失敗しました。`,
  ICL092: `インポートできました。`,
  ICL096: `登録・更新・削除処理に成功しました。`,
};