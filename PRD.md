# PRODUCT REQUIREMENTS DOCUMENT (PRD) : FlowText

## 1. Vue d'ensemble
**Nom du projet :** FlowText
**Type :** Extension Chrome/Edge & Landing Page
**Objectif :** Intégrer les fonctionnalités de stylisation de texte (type YayText) directement dans l'éditeur de post LinkedIn via une interface "Tooltip" flottante, pour éliminer la friction du changement d'onglet.

## 2. Stack Technique
* **Core Extension :** React, TypeScript, Vite.
* **Build Tool :** CRXJS (ou configuration Vite compatible Manifest V3).
* **Styling :** Tailwind CSS (préfixé ou dans le Shadow DOM pour éviter les conflits avec LinkedIn).
* **Hébergement (Landing Page) :** Vercel.
* **Iconographie :** Lucide React ou Heroicons.

## 3. Fonctionnalités (MVP)

### A. Le Déclencheur (Trigger)
* **Event Listener :** L'extension écoute la sélection de texte (`mouseup`) spécifiquement sur le domaine `linkedin.com`.
* **Cible :** Doit fonctionner dans les zones `div[contenteditable="true"]` (l'éditeur de post principal, les commentaires, et la messagerie).
* **Comportement :**
    * SI du texte est sélectionné -> Afficher la Tooltip au-dessus de la sélection.
    * SI on clique ailleurs -> La Tooltip disparaît.

### B. Interface Utilisateur (UI) - La Tooltip
* **Design :** Minimaliste, compacte, fond sombre (Dark Mode par défaut pour le contraste), coins arrondis. Inspiré de la barre d'outils Medium ou Notion.
* **Boutons Principaux (Accès rapide) :**
    * **𝐁** (Bold Serif)
    * *𝑖* (Italic Serif)
    * **𝙱** (Bold Script/Monospace - au choix)
    * Use Case : 3 ou 4 icônes max.
* **Menu Déroulant "More" :** Une icône caret/flèche qui ouvre une liste pour les styles moins fréquents (Cursive, Strikethrough, Bubbles, etc.).

### C. Logique de Transformation (Core)
* **Mapping Unicode :** Une fonction utilitaire qui prend une `string` et un `styleType` en entrée, et retourne la `string` convertie en caractères Unicode.
* **Insertion DOM :**
    * Remplacer le texte sélectionné par le texte transformé.
    * **CRITIQUE :** Préserver le focus dans l'éditeur LinkedIn après le clic pour que l'utilisateur puisse continuer à écrire immédiatement.

### D. Landing Page (Hébergée sur Vercel)
* **Structure :** One-page simple.
* **Contenu :** Hero section avec démo interactive ("Tapez ici pour tester"), Screenshots, Bouton CTA "Download for Chrome".

## 4. Contraintes Techniques & Sécurité
* **Manifest V3 :** Obligatoire.
* **Isolation CSS :** Utiliser le **Shadow DOM** pour injecter la Tooltip. C'est impératif pour que le CSS de LinkedIn n'écrase pas le style de l'extension et vice-versa.
* **Performance :** Chargement lazy des composants. L'extension doit être invisible tant qu'il n'y a pas de sélection.

## 5. User Flow
1.  L'utilisateur rédige un post sur LinkedIn.
2.  Il sélectionne le mot "Exclusif".
3.  La bulle FlowText apparaît instantanément au-dessus du curseur.
4.  L'utilisateur clique sur l'icône **B** (Gras).
5.  Le mot devient "𝐄𝐱𝐜𝐥𝐮𝐬𝐢𝐟".
6.  La bulle disparaît, le curseur est placé à la fin du mot pour continuer la frappe.