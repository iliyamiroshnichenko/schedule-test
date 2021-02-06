export default function parseLocalSrorage() {
  const values = [];
  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key) || key.length !== 36) {
      continue;
    }
    const value = JSON.parse(localStorage.getItem(key));
    values.push(value);
  }
  return values;
}
