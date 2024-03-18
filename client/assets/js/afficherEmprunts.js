let emprunts;
let reservations;
const empruntsArticle = $('#emprunts');
const reservationsArticle = $('#reservations');


//------- écouteur au chargement de la page --------//

document.addEventListener('DOMContentLoaded', async function () {
    emprunts = await loadEmpruntsUser();
    reservations = await loadReservationsUser();
    console.log(emprunts)
    mettreAJourAffichage(emprunts, empruntsArticle, 'emprunt')
    mettreAJourAffichage(reservations, reservationsArticle, 'reservation')


  });

async function loadEmpruntsUser() {
    try {
      const response = await axios.get(`/api/data/empruntsUser/${userId}`);  
      emprunts = response.data;
      console.log(emprunts)
      return emprunts
    } catch (error) {
      console.error('Erreur lors de la récupération des données', error);
    }
}

async function loadReservationsUser() {
  try {
    const response = await axios.get(`/api/data/reservationsUser/${userId}`);  
    reservations = response.data;
    console.log(reservations)
    return reservations
  } catch (error) {
    console.error('Erreur lors de la récupération des données', error);
  }
}

function mettreAJourAffichage(emprunts, article, articleString) {
  article.empty();
  console.log(article)
    emprunts.forEach(emprunt => {
      const retour = new Date(emprunt.createdAt);
      retour.setDate(retour.getDate() + 30);
      const retourFormatted = `${retour.getDate()}/${retour.getMonth() + 1}/${retour.getFullYear()}`;
      let authorsString = '<p class="text-danger">'
      const rendre = articleString == 'emprunt' ? `${emprunt.etat == "en retard" ? '<small>En retard !</small>' : `<small>A rendre avant le : ${retourFormatted}</small>`}` : `
        <form action="/annulerReservation" method="POST" style="display: inline;">
          <button type="submit" class="btn btn-light">Annuler</button>
          <input type="hidden" name="bookId" value="${emprunt.livre.ISBN}">
        </form>
      `
      emprunt.auteurs.forEach((author, index) => {
        authorsString += `${author.prenom} ${author.nom}`;
        // Ajouter une virgule si ce n'est pas le dernier auteur
        if (index < emprunt.auteurs.length - 1) {
          authorsString += ', ';
        }
      });
      authorsString += '</p>'
      article.append(`
        <div class="list-group-item ${emprunt.etat == "en retard" ? 'list-group-item-danger' : ''}" class="list-group-item">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${emprunt.livre.titre}</h5>
            ${rendre}
          </div>
          ${authorsString}
          <small>${emprunt.editeur[0].nom.toString()}</small>
        </div>
      `);
    })       
};