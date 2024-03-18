# PTUT projet_bibliothèque

## Equipe

- Matthias NADAL : Chef de Projet
- Matthias LABIT : Developpeur
- Haoni WU : Developpeur
- Chris RIEU : Developpeur
- Roxana GROSFILS : Developpeuse
- Yassine SAIDANE : Developpeur

## Infos Générales

Les objectifs généraux du LMS(système de gestion de bibliothèque en ligne) sont

- gérer les livres
- l'insertion des livres
- la réservation de livres
- l'emprunt et le suivi des emprunts
- gérer les pénalités 

Notre projet a pour but de rendre plus simple aux libraires et aux détenteurs de bibliothèques la gestion des emprunts de livres et de leurs collections de livres afin de fluidifier ce trafic via des comptes adherents et différentes règles.


## Cas D'utilisation Général 

un nouveau client souhaite emprunter un livre. Il se dirige vers un libraire et se crée un compte adhérent et choisit les livres qu'il souhaite emprunter. Le libraire boucle l'emprunt via le LMS et le client repart avec les livres empruntés et il les ramène avant la date limite d'emprunt. 


## Rôles

### Libraire
- Insérer, modifier l'état d'un livre et supprimer des livres.
- Peut obtenir les informations de tout membre ayant emprunté un livre.
- Ajouter et éditer des catégories de livres et classer les livres par catégories.
- Ajouter et modifier des informations sur les auteurs et les éditeurs.
- Peut envoyer des avertissements de retard aux personnes qui ont dépassé la date limite.
- Saisir les sorties et les retours de livres.


### Adherent
- Peut s'abonner
- Peut recevoir des informations actualisées sur le catalogue de livres.
- Peut vérifier les informations de son compte et les mettre à jour.
- Avoir la possibilité de rechercher des livres par sujet, titre, auteur ou toute autre information relative au livre.
- Peut mettre des livres en attente.


## Règles d'emprunt 

- Un livre qui a été mis en attente et dont l'attente n'a pas expiré n'est pas disponible.
- Un livre qui a été retiré est indisponible.
- Lorsque la période de mise en attente a expiré, le livre devient disponible.
- Après l'enregistrement d'un retour de livre, le livre devient disponible.
- Lorsqu'un livre est emprunté, la mise en attente est terminée et la procédure de retour commence.
- Un lecteur peut mettre un livre en attente s'il est disponible.
- Les livres en retard et les livres en attente expirés sont vérifiés quotidiennement.
- Les commandes en retard sont enregistrées.
- Le dépassement d'un délai de paiement entraîne des frais pour l'utilisateur concerné et une pénalité dans son dossier.
- Si une commande est en retard, elle est désenregistrée dès que le livre est rendu.
- Au moment du retour d'un livre, le processus d'application des frais commence.
- Un utilisateur qui a été pénalisé 3 fois sera mis sur la liste noire de la bibliothèque et banni du système pendant un an.
- système pendant un an.
- La durée de rétention est de 120 heures maximum.
- La durée d'emprunt est de 60 jours maximum.
- Le nombre maximum de livres mis en attente par un seul utilisateur est de 3.
- Le nombre maximum de livres empruntés par un seul utilisateur est de 5.
- Les frais de retard sont de 5 € par jour.
- Le nombre maximum de pénalités est de 3.

## Technologies utilisées

### Front-end : 
- JavaScript
- CSS
- HTML
### Back-end : 
- Node.js
- MongoDB
