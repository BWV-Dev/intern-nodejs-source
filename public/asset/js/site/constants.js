/************ VALUE LIST ***************/
const valueLst = {
  // 無効化フラグ
  disableFlgs: {
      0: '有効',
      1: '無効'
  },
}

var MIN_TRUNCATE_LENGTH = 20;
var ACCEPT_IMAGE_TYPE = ['image/png', 'image/jpeg', 'image/gif'];
var ACCEPT_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

var messages = {
  ECL010: 'データが選択されていません。',
  DISABLED_POPUP_INFORM: 'ポップアップの自動表示はデフォルトでブロックされています。このサイトを例外リストに追加してください。',
  ECL002: '{0}は「{1}」文字以下で入力してください。（現在「{2}」文字）',
  ECL009: '開始日に終了日以降の日付を入力して検索することはできません。',
  ECL021: 'ファイル形式が誤っています。CSVを選択してください。',
  ECL023: 'ファイルのサイズ制限10MBを超えています。',
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
}