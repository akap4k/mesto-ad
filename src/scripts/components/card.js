
// Получаем шаблон карточки из index.html
const cardTemplate = document.querySelector('#card-template');

// Функция создания карточки принимает данные карточки и ID текущего пользователя
export function createCard(cardData, userId) {
  // Клонируем шаблон
  const cardElement = cardTemplate.content.cloneNode(true);
  
  // Находим элементы внутри карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  
  // Заполняем данные из сервера
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;
  
  // Проверяем, лайкнул ли текущий пользователь эту карточку
  const isLiked = cardData.likes.some(like => like._id === userId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }
  
  // Показываем корзину ТОЛЬКО для своих карточек
  if (cardData.owner._id !== userId) {
    deleteButton.remove(); // Удаляем кнопку корзины из DOM
  }
  
  // Обработчик лайка
  likeButton.addEventListener('click', () => {
    // Проверяем, активна ли сейчас кнопка лайка
    const isCurrentlyLiked = likeButton.classList.contains('card__like-button_is-active');
    
    // Импортируем функцию из api.js (добавим импорт позже в index.js)
    // Пока просто заглушка
    console.log('Лайк нажат, карточка ID:', cardData._id, 'лайкнут:', isCurrentlyLiked);
  });
  
  // Обработчик удаления (только если кнопка существует)
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      console.log('Удаление карточки ID:', cardData._id);
    });
  }
  
  // Обработчик открытия полноразмерного изображения
  cardImage.addEventListener('click', () => {
    console.log('Открыть изображение:', cardData.link);
  });
  
  // Возвращаем DOM-элемент карточки
  return cardElement;
}
