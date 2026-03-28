/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/
import { getUserInfo, getCardList, setUserInfo, setUserAvatar, addNewCard, deleteCard, changeLikeCardStatus } from './components/api.js';


//import { initialCards } from "./cards.js";

import { 
  getUserInfo, 
  getCardList, 
  setUserInfo, 
  setUserAvatar, 
  addNewCard, 
  deleteCard, 
  changeLikeCardStatus 
} from './components/api.js';

import { createCard } from './components/card.js';


import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";

let currentUserId = null; // Будет хранить ID текущего пользователя

// DOM узлы
const cardsContainer = document.querySelector('.places__list');

const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  
  const nameInput = document.querySelector('.popup__input_type_name');
  const aboutInput = document.querySelector('.popup__input_type_description');
  
  setUserInfo({
    name: nameInput.value,
    about: aboutInput.value,
  })
    .then((userData) => {
      // Обновляем данные на странице
      const profileName = document.querySelector('.profile__title');
      const profileDescription = document.querySelector('.profile__description');
      
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      
      // Закрываем модальное окно
      const modal = document.querySelector('.popup_type_edit');
      closeModalWindow(modal);
    })
    .catch((err) => {
      console.log('Ошибка при сохранении профиля:', err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  profileAvatar.style.backgroundImage = `url(${avatarInput.value})`;
  closeModalWindow(avatarFormModalWindow);
};

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Создание...';
  
  const nameInput = document.querySelector('.popup__input_type_card-name');
  const linkInput = document.querySelector('.popup__input_type_url');
  
  addNewCard({
    name: nameInput.value,
    link: linkInput.value,
  })
    .then((newCard) => {
      // Создаем карточку и добавляем в начало списка
      const cardElement = createCard(newCard, currentUserId);
      cardsContainer.prepend(cardElement);
      
      // Закрываем модальное окно и очищаем форму
      const modal = document.querySelector('.popup_type_new-card');
      closeModalWindow(modal);
      evt.target.reset();
    })
    .catch((err) => {
      console.log('Ошибка при создании карточки:', err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  openModalWindow(cardFormModalWindow);
});

// отображение карточек
/*initialCards.forEach((data) => {
  placesWrap.append(
    createCardElement(data, {
      onPreviewPicture: handlePreviewPicture,
      onLikeIcon: likeCard,
      onDeleteCard: deleteCard,
    })
  );
});*/

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});


Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    // Сохраняем ID текущего пользователя глобально
    currentUserId = userData._id;
    
    // Обновляем данные профиля
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;
    
    // делаем карточки
    cards.forEach((card) => {
      const cardElement = createCard(card, currentUserId);
      cardsContainer.append(cardElement);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Загрузка данных с сервера при старте
Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    // Сохраняем ID текущего пользователя
    currentUserId = userData._id;
    
    // Обновляем данные профиля на странице
    const profileName = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');
    const profileAvatar = document.querySelector('.profile__image');
    
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    
    // Отрисовываем каждую карточку
    cards.forEach((card) => {
      const cardElement = createCard(card, currentUserId);
      cardsContainer.append(cardElement);
    });
  })
  .catch((err) => {
    console.log('Ошибка загрузки данных:', err);
  });
