/**
 * 구하다 서비스가 요구하는 유효한 비민번호 형식인지 확인.
 * @param {*} val
 */
export default function(val = '') {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(
    val
  );
}