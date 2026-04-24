// ============================================================
// ÉTAPE A : On "attrape" les éléments HTML dont on a besoin
// document.getElementById() cherche un élément par son id=""
// ============================================================
 
const champJour   = document.getElementById('jour');
const champMois   = document.getElementById('mois');
const champAnnee  = document.getElementById('annee');
 
const erreurJour  = document.getElementById('erreur-jour');
const erreurMois  = document.getElementById('erreur-mois');
const erreurAnnee = document.getElementById('erreur-annee');
 
const bouton        = document.getElementById('bouton-calculer');
 
const zoneAnnees  = document.getElementById('resultat-annees');
const zoneMois    = document.getElementById('resultat-mois');
const zoneJours   = document.getElementById('resultat-jours');

// ============================================================
// ÉTAPE B : Vérifier que les données saisies sont correctes
// ============================================================
 
function nombreDeJoursDansMois(annee, mois) {
  // new Date(annee, mois, 0) : le 0ème jour du mois suivant
  // = dernier jour du mois actuel. Malin !
  return new Date(annee, mois, 0).getDate();
}
 
function validerEtCalculer() {
 
  // 1. Effacer les anciennes erreurs
  effacerErreurs();
 
  // 2. Lire les valeurs saisies (parseInt = convertir texte en nombre)
  const jour  = parseInt(champJour.value);
  const mois  = parseInt(champMois.value);
  const annee = parseInt(champAnnee.value);
 
  // 3. Vérifier que les champs ne sont pas vides
  let formulaireValide = true;
 
  if (!champJour.value) {
    afficherErreur(erreurJour, champJour, 'Ce champ est obligatoire');
    formulaireValide = false;
  } else if (jour < 1 || jour > 31) {
    afficherErreur(erreurJour, champJour, 'Doit être entre 1 et 31');
    formulaireValide = false;
  }
 
  if (!champMois.value) {
    afficherErreur(erreurMois, champMois, 'Ce champ est obligatoire');
    formulaireValide = false;
  } else if (mois < 1 || mois > 12) {
    afficherErreur(erreurMois, champMois, 'Doit être entre 1 et 12');
    formulaireValide = false;
  }
 
  const anneeActuelle = new Date().getFullYear();
  if (!champAnnee.value) {
    afficherErreur(erreurAnnee, champAnnee, 'Ce champ est obligatoire');
    formulaireValide = false;
  } else if (annee > anneeActuelle) {
    afficherErreur(erreurAnnee, champAnnee, 'Année dans le futur !');
    formulaireValide = false;
  }
 
  // 4. Vérifier que le jour existe dans ce mois
  if (formulaireValide && jour > nombreDeJoursDansMois(annee, mois)) {
    afficherErreur(erreurJour, champJour, 'Date invalide pour ce mois');
    formulaireValide = false;
  }
 
  // 5. Si tout est bon, on calcule !
  if (formulaireValide) {
    calculerAge(jour, mois, annee);
  }
}


// ============================================================
// ÉTAPE C : Fonctions utilitaires (afficher / cacher erreurs)
// ============================================================
 
function afficherErreur(zoneErreur, champInput, message) {
  zoneErreur.textContent = message;    // Affiche le message
  champInput.classList.add('erreur-input'); // Bord rouge
}
 
function effacerErreurs() {
  // Efface tous les messages d'erreur
  [erreurJour, erreurMois, erreurAnnee].forEach(zone => {
    zone.textContent = '';
  });
  // Retire le style rouge des champs
  [champJour, champMois, champAnnee].forEach(champ => {
    champ.classList.remove('erreur-input');
  });
}


// ============================================================
// ÉTAPE D : Calculer l'âge exact en années, mois, jours
// ============================================================
 
function calculerAge(jour, mois, annee) {
 
  // Récupère la date d'aujourd'hui
  const aujourd_hui = new Date();
 
  // Calcule les différences brutes
  let nbAnnees = aujourd_hui.getFullYear() - annee;
  let nbMois   = (aujourd_hui.getMonth() + 1) - mois; // +1 car les mois commencent à 0 en JS
  let nbJours  = aujourd_hui.getDate() - jour;
 
  // Ajustement si les jours sont négatifs
  // Ex: né le 20, et aujourd'hui c'est le 10 → on "emprunte" un mois
  if (nbJours < 0) {
    nbMois--;
    // Nombre de jours du mois précédent
    const moisPrecedent = aujourd_hui.getMonth() === 0 ? 12 : aujourd_hui.getMonth();
    nbJours += nombreDeJoursDansMois(aujourd_hui.getFullYear(), moisPrecedent);
  }
 
  // Ajustement si les mois sont négatifs
  // Ex: né en octobre, et on est en mars → on "emprunte" une année
  if (nbMois < 0) {
    nbAnnees--;
    nbMois += 12;
  }
 
  // Afficher les résultats avec animation
  animerNombre(zoneAnnees, nbAnnees);
  animerNombre(zoneMois,   nbMois);
  animerNombre(zoneJours,  nbJours);
}


// ============================================================
// ÉTAPE E : Animation des nombres (compte de 0 jusqu'au résultat)
// ============================================================
 
function animerNombre(element, valeurFinale) {
  let compteur = 0;
  const pas = Math.max(1, Math.ceil(valeurFinale / 20));
 
  // setInterval exécute la fonction toutes les 30 millisecondes
  const minuterie = setInterval(function() {
    compteur = Math.min(compteur + pas, valeurFinale);
    element.textContent = compteur;  // Mise à jour de l'affichage
 
    // Quand on a atteint la valeur finale, on arrête
    if (compteur >= valeurFinale) {
      clearInterval(minuterie);
    }
  }, 30);
}
 
// ============================================================
// ÉTAPE F : Écouter le clic sur le bouton
// addEventListener attend un événement puis déclenche une action
// ============================================================
 
bouton.addEventListener('click', validerEtCalculer);
 
// BONUS : Permettre d'appuyer sur Entrée pour calculer
[champJour, champMois, champAnnee].forEach(function(champ) {
  champ.addEventListener('keydown', function(evenement) {
    if (evenement.key === 'Enter') {
      validerEtCalculer();
    }
  });
});