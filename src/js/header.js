fetch('/src/__parts/header.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('header').innerHTML = html
  })