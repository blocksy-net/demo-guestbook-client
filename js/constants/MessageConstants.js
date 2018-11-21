/**
 * The MIT License
 *
 * Copyright (c) 2017-2018 Symag. http://www.symag.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @desc Texts
 *
 * @author BlockSY team - blocksy@symag.com
 */

import { isNull } from '../utils/commons'


export const FIELD_MISSING = 'FIELD_MISSING' //'please fill out the entire form';
export const WRONG_PASSWORD = 'WRONG_PASSWORD' //'password entered is wrong';
export const USER_NOT_FOUND = 'USER_NOT_FOUND' //'this username does not exist';
export const USERNAME_TAKEN = 'USERNAME_TAKEN' // 'this username is already taken';
export const GENERAL_ERROR = 'GENERAL_ERROR' // //'something went wrong, please try again';
export const AUTH_ERROR = 'AUTH_ERROR' // //'authentication error, please try again';

export const MESSAGE_CREATE = 'MESSAGE_CREATE' ////'Do you want to proceed and send this message?';

export const ERROR_APPLICATION = 'ERROR_APPLICATION' ////'application error, you should report it to support@blocksy.io'
export const ERROR_FORM_EMAIL = 'ERROR_FORM_EMAIL' ////'the email you entered is invalid';
export const ERROR_FORM_NAME = 'ERROR_FORM_NAME' ////'your name appears to be invalid';
export const ERROR_FORM_COMPANY = 'ERROR_FORM_COMPANY' //// 'your company name appears to be invalid';
export const ERROR_FORM_PIN = 'ERROR_FORM_PIN' ////'please enter a 4 digits pin code';
export const ERROR_FORM_NO_CHANGE = 'ERROR_FORM_NO_CHANGE' ////'we did not detect any change to save';
export const ERROR_FORM_MESSAGE = 'ERROR_FORM_MESSAGE' ////'please review your experience and write a feedback';

export function getTexts(lang){
  var texts = {}
  for(var key in TEXTS)
    if (TEXTS.hasOwnProperty(key)) {
      texts[key] = TEXTS[key][lang.key]
      if (isNull(texts[key])) texts[key]="! NO_TEXT_DEFINED !"
    }

  return texts
}

export const TEXTS = {
  'FIELD_MISSING': {
    'en_US': 'please fill out the entire form',
    'fr_FR': 'merci de compléter le formulaire'
  },
  'WRONG_PASSWORD': {
    'en_US': 'password entered is wrong',
    'fr_FR': 'le mot de passe entré est invalide'
  },
  'USER_NOT_FOUND': {
    'en_US': 'this username does not exist',
    'fr_FR': 'cet utilisateur n\'existe pas'
  },
  'USERNAME_TAKEN': {
    'en_US': 'this username is already taken',
    'fr_FR': 'ce nom d\'utilisateur est déjà pris'
  },
  'GENERAL_ERROR': {
    'en_US': 'something went wrong, please try again',
    'fr_FR': 'une erreur s\'est produite, veuillez réessayer'
  },
  'AUTH_ERROR': {
    'en_US': 'authentication error, please try again',
    'fr_FR': 'une erreur d\'authentification s\'est produite, veuillez réessayer'
  },
  'MESSAGE_CREATE': {
    'en_US': 'Do you want to proceed and send this message?',
    'fr_FR': 'Voulez-vous poursuivre et publier votre message?'
  },
  'ERROR_APPLICATION': {
    'en_US': 'application error, you should report it to blocksy@symag.com',
    'fr_FR': 'Erreur d\'application, merci de reporter cette erreur à notre support blocksy@symag.com'
  },
  'ERROR_FORM_EMAIL': {
    'en_US': 'the email you entered is invalid',
    'fr_FR': 'l\'email que vous avez entré est invalide'
  },
  'ERROR_FORM_EMAIL_EXISTS': {
    'en_US': 'This email already exists in our records, you can only review one time.',
    'fr_FR': 'Cet email existe déjà dans notre registre, vous ne pouvez publier votre avis qu\'une seul fois.'
  },
  'ERROR_FORM_NAME': {
    'en_US': 'your name appears to be invalid',
    'fr_FR': 'le nom entré est invalide'
  },
  'ERROR_FORM_COMPANY': {
    'en_US': 'your company name appears to be invalid',
    'fr_FR': 'le nom de votre entreprise est invalide'
  },
  'ERROR_FORM_PIN': {
    'en_US': 'please enter a 4 digits pin code',
    'fr_FR': 'merci de renseigner les 4 chiffres de votre code PIN'
  },
  'ERROR_FORM_NO_CHANGE': {
    'en_US': 'we did not detect any change to save',
    'fr_FR': 'nous n\'avons détecté aucun changement à sauvegarder'
  },
  'ERROR_FORM_MESSAGE': {
    'en_US': 'please review your experience and write a feedback',
    'fr_FR': 'merci de nous laisser votre avis et renseigner le champ du formulaire associé'
  },
  'HEADER_CREDITS':{
    'en_US': 'credits',
    'fr_FR': 'crédits'
  },
  'HEADER_LOGS':{
    'en_US': 'logs',
    'fr_FR': 'logs'
  },
  'HEADER_TERMS':{
    'en_US': 'terms',
    'fr_FR': 'CGU'
  },
  'HEADER_HOME':{
    'en_US': 'home',
    'fr_FR': 'accueil'
  },
  'CREDITS_TEAM':{
    'en_US': 'BlockSY Team',
    'fr_FR': 'Equipe BlockSY'
  },
  'CREDITS_STACK':{
    'en_US': 'Technical Stack',
    'fr_FR': 'Stack Technique'
  },
  'CREDITS_ENGINEER':{
    'en_US': 'Full stack Engineer',
    'fr_FR': 'Ingénieur full stack'
  },
  'CREDITS_BLOCKCHAIN_EXPERT':{
    'en_US': 'Blockchain Expert',
    'fr_FR': 'Expert Blockchain'
  },
  'CREDITS_APP_INFOS':{
    'en_US': 'Application Infos',
    'fr_FR': 'Informations Application'
  },
  'MAIN_TABS_PUBLISH':{
    'en_US': 'Publish',
    'fr_FR': 'Participer'
  },
  'MAIN_TABS_MESSAGES':{
    'en_US': 'Reviews',
    'fr_FR': 'Avis'
  },
  'MAIN_TABS_DONATIONS':{
    'en_US': 'Results',
    'fr_FR': 'Résultats'
  },
  'MAIN_DONATIONS_PROGRESS_RAISED':{
     'en_US': 'on',
     'fr_FR': 'sur'
  },
  'MAIN_DONATIONS_NAME':{
    'en_US': 'name',
    'fr_FR': 'nom'
  },
  'MAIN_DONATIONS_FOR':{
    'en_US': 'to',
    'fr_FR': 'à'
  },
  'MAIN_MESSAGES_LOADING':{
    'en_US': 'No message has been posted yet.',//'loading reviews',
    'fr_FR': 'Aucun message à afficher pour le moment. '//'chargement des avis'
  },
  'MAIN_MESSAGES_NODATA':{
    'en_US': 'This page is refreshed automatically.',
    'fr_FR': 'Cette page est rafraîchie automatiquement.'
  },
  'MAIN_MESSAGES_CERTIFICATE':{
    'en_US': 'certificate delivered by',
    'fr_FR': 'certificat délivré par la blockchain'
  },
  'MAIN_MESSAGES_WITH':{
    'en_US': 'blockchain with',
    'fr_FR': 'avec'
  },
  'MAIN_MESSAGES_CONFIRMATIONS':{
    'en_US': 'confirmations',
    'fr_FR': 'confirmations'
  },
  'MAIN_MESSAGES_AWAITINGCONFIRMATION':{
    'en_US': 'pending confirmation',
    'fr_FR': 'en attente de confirmation'
  },
  'REGISTERFORM_TITLE':{
    'en_US': 'Post a review',
    'fr_FR': 'Publier votre avis'
  },
  'REGISTERFORM_BUTTON_POST':{
    'en_US': 'post',
    'fr_FR': 'publier'
  },
  'REGISTERFORM_POPUP_REGISTERACCOUNT_TITLE':{
    'en_US': 'register account',
    'fr_FR': 'création de compte'
  },
  'REGISTERFORM_POPUP_REGISTERACCOUNT_TITLE_BODY':{
    'en_US': 'Please confirm that you want to register your account.',
    'fr_FR': 'Veuillez maintenant confirmer la création de votre compte.'
  },
  'REGISTERFORM_POPUP_REGISTERACCOUNT_TITLE_BUTTONS_DECLINE':{
    'en_US': 'no',
    'fr_FR': 'non'
  },
  'REGISTERFORM_POPUP_REGISTERACCOUNT_TITLE_BUTTONS_CONFIRM':{
    'en_US': 'yes',
    'fr_FR': 'oui'
  },
  'REGISTERFORM_POPUP_ERROR_TITLE':{
    'en_US': 'an error occured',
    'fr_FR': 'rapport d\'erreur '
  },
  'REGISTERFORM_POPUP_ERROR_BUTTONS_CANCEL':{
    'en_US': 'back',
    'fr_FR': 'retour'
  },
  'REGISTERFORM_GDPR_AUTHORIZE':{
    'en_US': 'I allow',
    'fr_FR': 'J\'autorise'
  },
  'REGISTERFORM_GDPR_PUBLISH':{
    'en_US': 'to publish this message in this application',
    'fr_FR': 'à publier ce message sur cette application'
  },
  'REGISTERFORM_GDPR_TWITTER':{
    'en_US': 'and to publish it on my Twitter account',
    'fr_FR': 'et à le publier sur mon compte Twitter'
  },
  'REGISTERDETAILS_TWITTER_LOGIN':{
    'en_US': 'login',
    'fr_FR': 'se connecter'
  },
  'REGISTERDETAILS_TWITTER_LOGOUT':{
    'en_US': 'logout',
    'fr_FR': 'se déconnecter'
  },
  'REGISTERDETAILS_NAME':{
    'en_US': 'Name',
    'fr_FR': 'Nom'
  },
  'REGISTERDETAILS_NAME_PLACEHOLDER':{
    'en_US': 'John Doe',
    'fr_FR': 'Jean Martin'
  },
  'REGISTERDETAILS_COMPANY':{
    'en_US': 'Company',
    'fr_FR': 'Entreprise'
  },
  'REGISTERDETAILS_COMPANY_PLACEHOLDER':{
    'en_US': 'Your company',
    'fr_FR': 'Ma société'
  },
  'REGISTERDETAILS_EMAIL':{
    'en_US': 'Email',
    'fr_FR': 'Email'
  },
  'REGISTERDETAILS_EMAIL_PLACEHOLDER':{
    'en_US': 'myemail@company.com',
    'fr_FR': 'monmail@société.com'
  },
  'REGISTERDETAILS_PINCODE':{
    'en_US': 'Choose a PIN code that will protect your BlockSY wallet',
    'fr_FR': 'Choisissez un code PIN afin de protéger votre wallet BlockSY'
  },
  'REGISTERDETAILS_MESSAGE_PLACEHOLDER':{
    'en_US': 'write your review, we will add it to our guestbook',
    'fr_FR': 'écrivez votre avis, celui-ci sera inscrit au sein de notre registre'
  },
  'REGISTERDETAILS_MESSAGE_LABEL':{
    'en_US': 'Tell us about your experience at',
    'fr_FR': 'Donnez-nous votre avis sur'
  },
  'BLOCKCHAIN_SELECTOR_LABEL':{
    'en_US': 'Select blockchain to use',
    'fr_FR': 'Choisissez la blockchain à utiliser'
  }

}
