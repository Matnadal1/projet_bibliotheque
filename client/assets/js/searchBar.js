let input = document.getElementById("searchInput");
let list = document.getElementById("liste");
let items = document.getElementsByClassName("searchItem");

input.addEventListener("input", function() {
  let searchText = this.value.toLowerCase();

  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let itemText = item.innerHTML.toLowerCase();

    if (itemText.indexOf(searchText) !== -1) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  }
});

