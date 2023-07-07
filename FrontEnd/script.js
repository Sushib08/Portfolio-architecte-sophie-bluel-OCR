window.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const projectGallery = document.getElementById("gallery");
      data.forEach((work) => {
        const id = work.id;
        const title = work.title;
        const imageUrl = work.imageUrl;
        const categoryId = work.category.id;
        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        const titleElement = document.createElement("figcaption");
        workElement.setAttribute("data-category", categoryId);
        workElement.setAttribute("data-id", id);
        imageElement.src = imageUrl;
        titleElement.textContent = title;

        console.log(`categoryId as ${categoryId}`);

        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);
        projectGallery.appendChild(workElement);
      });

      displayModalImages();
      setupDeleteImageHandlers();
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

  function deleteImage(id) {
    const token = sessionStorage.getItem("authToken");

    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`http://localhost:5678/api/works/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // Supprimer l'image correspondante dans #gallery-modal
        const galleryModal = document.getElementById("gallery-modal");
        const imageContainers =
          galleryModal.querySelectorAll(".image-container");
        imageContainers.forEach((container) => {
          const imageId = container.getAttribute("data-id");
          if (imageId === id) {
            container.remove();
          }
        });

        // Supprimer l'image correspondante dans #gallery
        const gallery = document.getElementById("gallery");
        const galleryFigures = gallery.querySelectorAll("figure");
        galleryFigures.forEach((figure) => {
          const imageId = figure.getAttribute("data-id");
          if (imageId === id) {
            figure.remove();
          }
        });
      })
      .catch((error) => {
        console.error(`Erreur lors de la suppression de l'image ${id}:`, error);
      });
  }

  function displayModalImages() {
    const galleryElements = document.querySelectorAll("#gallery figure");
    const galleryModal = document.getElementById("gallery-modal");

    galleryModal.innerHTML = "";
    galleryElements.forEach((galleryElement, index) => {
      const imageElement = document.createElement("img");
      const imageUrl = galleryElement.querySelector("img").src;
      const deleteIcon = document.createElement("i");
      const arrowIcon = document.createElement("i");
      const editText = document.createElement("div");
      const imageId = galleryElement.getAttribute("data-id");

      deleteIcon.className = "fas fa-trash-alt trash-icon";
      editText.textContent = "éditer";
      editText.classList.add("edit-img");

      imageElement.src = imageUrl;

      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");
      imageContainer.setAttribute("data-id", imageId);
      imageContainer.appendChild(imageElement);
      imageContainer.appendChild(deleteIcon);

      if (index === 0) {
        arrowIcon.className = "fas fa-arrows-up-down-left-right arrows-icon";
        imageContainer.appendChild(arrowIcon);
      }

      imageContainer.appendChild(editText);
      galleryModal.appendChild(imageContainer);
    });
  }

  function setupDeleteImageHandlers() {
    const trashIcons = document.querySelectorAll(".trash-icon");
    trashIcons.forEach((trashIcon) => {
      trashIcon.addEventListener("click", function () {
        const imageContainer = trashIcon.parentNode;
        const imageId = imageContainer.getAttribute("data-id");
        deleteImage(imageId);
      });
    });
  }

  function modifyEditClass() {
    const authToken = sessionStorage.getItem("authToken");
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

  modifyEditClass();

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove("hidden");
    modal.classList.add("modal-wrapper");
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove("modal-wrapper");
    modal.classList.add("hidden");
    if (modalId === "modal2") {
      resetModal2();
    }
  }

  const btnEdit = document.getElementById("btn-edit");
  btnEdit.addEventListener("click", () => openModal("modal1"));
  const closeIcon = document.querySelector("#modal1 .close");
  closeIcon.addEventListener("click", () => closeModal("modal1"));

  const btnAddImg = document.getElementById("btn-add-img");
  btnAddImg.addEventListener("click", () => openModal("modal2"));
  const closeIcon2 = document.querySelector("#modal2 .close");
  closeIcon2.addEventListener("click", () => closeModal("modal2"));

  const arrowLeftIcon = document.querySelector("#modal2 .arrow-left");
  arrowLeftIcon.addEventListener("click", () => {
    closeModal("modal2");
    resetModal2();
    openModal("modal1");
  });

  function resetModal2() {
    const frameAddImg = document.querySelector(".frame-addImg");
    frameAddImg.innerHTML = `
      <img src="../FrontEnd/assets/icons/picture-svgrepo-com 1.svg" alt="img" />
      <button class="btn-addImg">+ Ajouter photo</button>
      <p class="format">jpg, png : 4mo max</p>
    `;

    const btnAddImg = document.querySelector(".btn-addImg");
    const formatParagraph = document.querySelector(".format");

    btnAddImg.style.display = "block";
    formatParagraph.style.display = "block";

    const inputTitre = document.getElementById("inputTitre");
    const selectCategorie = document.getElementById("selectCategorie");

    inputTitre.value = "";
    selectCategorie.value = "";

    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "none";
  }

  function closeModalOnClickOutside(event) {
    const modals = ["modal1", "modal2"];
    modals.forEach((modalId) => {
      const modal = document.getElementById(modalId);
      if (
        !modal.contains(event.target) &&
        !modal.classList.contains("hidden")
      ) {
        closeModal(modalId);
        if (modalId === "modal2") {
          resetModal2();
        }
      }
    });
  }

  window.addEventListener("mousedown", closeModalOnClickOutside);

  document.body.addEventListener("click", function (event) {
    if (event.target.matches(".btn-addImg")) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/jpeg, image/png";
      fileInput.style.display = "none";
      fileInput.addEventListener("change", handleFileSelection);
      fileInput.classList.add("fileInput");

      document.body.appendChild(fileInput);

      fileInput.click();
    }
  });

  function handleFileSelection(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (!file) {
      console.log("Aucun fichier sélectionné.");
      return;
    }

    const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
    if (file.size > maxSize) {
      console.log("La taille du fichier dépasse 4 Mo.");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      console.log("Type de fichier non pris en charge.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const frameAddImg = document.querySelector(".frame-addImg");
      frameAddImg.innerHTML = "";

      const imageElement = document.createElement("img");
      imageElement.src = reader.result;
      imageElement.classList.add("selectedImg");
      frameAddImg.appendChild(imageElement);
    };
    reader.readAsDataURL(file);

    const btnAddImg = document.querySelector(".btn-addImg");
    const formatParagraph = document.querySelector(".format");
    btnAddImg.style.display = "none";
    formatParagraph.style.display = "none";
  }

  function populateCategoryOptions() {
    const selectCategorie = document.getElementById("selectCategorie");
    fetch("http://localhost:5678/api/categories")
      .then((response) => response.json())
      .then((data) => {
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "";
        selectCategorie.appendChild(defaultOption);

        data.forEach((category) => {
          const categoryId = category.id;
          const categoryName = category.name;

          const option = document.createElement("option");
          option.value = categoryId;
          option.textContent = categoryName;

          selectCategorie.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des catégories :", error);
      });
  }

  populateCategoryOptions();

  const validateButton = document.querySelector(".validate");
  const errorMessage = document.getElementById("error-message");

  validateButton.addEventListener("click", function (event) {
    event.preventDefault(); // Empêcher le rechargement de la page par défaut

    const fileInput = document.querySelector(".fileInput");
    const inputTitre = document.getElementById("inputTitre");
    const selectCategorie = document.getElementById("selectCategorie");

    if (!fileInput || !inputTitre.value || selectCategorie.value === "") {
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";

      const formData = new FormData();
      formData.append("image", fileInput.files[0]);
      formData.append("title", inputTitre.value);
      formData.append("category", selectCategorie.value);

      const token = sessionStorage.getItem("authToken");

      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      };

      fetch("http://localhost:5678/api/works", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          const projectGallery = document.getElementById("gallery");

          const workElement = document.createElement("figure");
          workElement.setAttribute("data-category", data.category.id);
          workElement.setAttribute("data-id", data.id);

          const imageElement = document.createElement("img");
          imageElement.src = data.imageUrl;

          const titleElement = document.createElement("figcaption");
          titleElement.textContent = data.title;

          workElement.appendChild(imageElement);
          workElement.appendChild(titleElement);
          projectGallery.appendChild(workElement);

          closeModal("modal2");
          resetModal2();
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi du formulaire :", error);
        });
    }
  });
});
