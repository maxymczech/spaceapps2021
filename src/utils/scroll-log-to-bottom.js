export default function() {
  const element = document.querySelector('.console-log-in');
  if (element) {
    element.scrollTo(0, element.scrollHeight);
  }
}
