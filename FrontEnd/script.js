window.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const projectGallery = document.getElementById("gallery");
      data.forEach((work) => {
        const title = work.title;
        const imageUrl = work.imageUrl;
        const categoryId = work.category.id;
        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        const titleElement = document.createElement("figcaption");
        workElement.setAttribute("data-category", categoryId);
        imageElement.src = imageUrl;
        titleElement.textContent = title;

        console.log(`categoryId as ${categoryId}`);

        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);
        projectGallery.appendChild(workElement);
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des travaux:", error);
    });

  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      const filter = document.getElementById("filter");

      const selectButton = (button) => {
        const buttons = filter.querySelectorAll("button");
        buttons.forEach((btn) => {
          btn.classList.remove("selected");
        });
        button.classList.add("selected");
      };

      const allBtn = document.createElement("button");
      allBtn.textContent = "Tous";
      allBtn.setAttribute("data-category", "all");
      allBtn.classList.add("selected");
      allBtn.addEventListener("click", () => {
        const workElements = document.querySelectorAll("#gallery figure");
        workElements.forEach((workElement) => {
          workElement.style.display = "block";
        });
        selectButton(allBtn);
      });

      filter.appendChild(allBtn);

      data.forEach((category) => {
        const categoryId = category.id;
        const categoryName = category.name;

        const categoryBtn = document.createElement("button");
        categoryBtn.textContent = categoryName;
        categoryBtn.setAttribute("data-category", categoryId);
        categoryBtn.addEventListener("click", () => {
          const selectedCategory = categoryBtn.getAttribute("data-category");
          const workElements = document.querySelectorAll("#gallery figure");
          workElements.forEach((workElement) => {
            const workCategory = workElement.getAttribute("data-category");

            if (
              selectedCategory === "all" ||
              selectedCategory === workCategory
            ) {
              workElement.style.display = "block";
            } else {
              workElement.style.display = "none";
            }
          });
          selectButton(categoryBtn);
        });

        filter.appendChild(categoryBtn);
      });
    });

  // Fonction pour modifier la classe de la div #edit en fonction du token dans localStorage
  function modifyEditClass() {
    const authToken = localStorage.getItem("authToken");
    const editDiv = document.getElementById("edit");
    const filterDiv = document.getElementById("filter");
    const btn1Div = document.getElementById("btn1");
    const btnEdit = document.getElementById("btn-edit");

    if (authToken !== null && authToken !== "") {
      editDiv.classList.remove("hidden");
      editDiv.classList.add("edit");
      btn1Div.classList.remove("hidden");
      btn1Div.classList.add("btn-edit");
      btnEdit.classList.remove("hidden");
      btnEdit.classList.add("btn-edit");
      filterDiv.style.display = "none";
    } else {
      editDiv.classList.remove("edit");
      editDiv.classList.add("hidden");
      btn1Div.classList.remove("btn-edit");
      btn1Div.classList.add("hidden");
      btnEdit.classList.remove("btn-edit");
      btnEdit.classList.add("hidden");
      filterDiv.style.display = "block";
    }
  }

  // Appeler la fonction pour modifier la classe de la div #edit
  modifyEditClass();
});
