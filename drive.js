/* Stage Plan – Google Drive storage.
   Sign-in with Google Identity Services, files through the Drive v3 REST API.
   Scope: drive.file (only files created by this app). */
(function(){
"use strict";

/* ---------- translations ---------- */
const DRV = {
en:{
"drv.title":"Google Drive","drv.btn":"Drive",
"drv.fileWarn":"Google does not allow sign-in from a file opened on your computer. Publish the app at an https address (for example with GitHub Pages) and open it from there.",
"drv.intro":"Save projects and presets in the “{folder}” folder of your Google Drive and find them on every device. The app can only see the files it creates, not the rest of your Drive.",
"drv.login":"Sign in with Google","drv.resume":"Resume Google session","drv.changeCid":"Change the Google client ID",
"drv.setup.intro":"To connect the app to Google Drive you need a free “client ID”, created once in the Google Cloud console with your account.",
"drv.setup.steps":["Open console.cloud.google.com and create a new project, for example “Stage Plan”.","In APIs & Services › Library, search for Google Drive API and press Enable.","In Google Auth Platform (or “OAuth consent screen”) set the app up as External: name, support email and contact.","In Data access add the scope …/auth/drive.file.","In Audience press Publish app, so that every musician can sign in and not only test users.","In Clients create a client of type Web application and, under Authorised JavaScript origins, enter exactly this address:"],
"drv.setup.last":"Copy the client ID (it ends with .apps.googleusercontent.com) and paste it below.",
"drv.cidLabel":"Google client ID","drv.saveCid":"Save client ID","drv.copy":"Copy",
"drv.cidHint":"To spare every musician this step, whoever publishes the app can write it once in config.js or, on GitHub, in the GOOGLE_CLIENT_ID repository variable.",
"drv.signedIn":"Signed in as {who}","drv.logout":"Sign out",
"drv.current":"Current project",
"drv.conflict":"The file “{name}” on Drive was changed on another device ({date}). Automatic saving is paused.",
"drv.force":"Overwrite with this version","drv.openRemote":"Open the Drive version",
"drv.linked":"Linked to the file “{name}”.","drv.savedAt":"Saved at {time}.","drv.dirty":"There are unsaved changes.","drv.clean":"Nothing to save.",
"drv.notYet":"This project is not on Drive yet.",
"drv.fileName":"File name","drv.save":"Save to Drive","drv.saveAs":"Save as new file","drv.unlink":"Unlink",
"drv.auto":"Save to Drive automatically after every change",
"drv.list":"Projects on Drive","drv.refresh":"Refresh","drv.loading":"Loading the list…",
"drv.empty":"No projects saved in the “{folder}” folder.",
"drv.rowMeta":"modified {date}","drv.rowMetaCur":"open now, modified {date}",
"drv.open":"Open","drv.del":"Delete","drv.confirm":"Confirm","drv.trashNote":"Deleted files stay in the Drive trash for 30 days.",
"drv.presets":"Presets","drv.presetsHint":"Custom ensembles, layouts and stages already travel inside every project. Here you can also save or load them on their own, to use them on another device.",
"drv.psave":"Save presets to Drive","drv.pload":"Load presets from Drive",
"drv.unsavedOpen":"The current project has changes not saved to Drive. Press “Open” again to continue anyway.",
"drv.copySuffix":" (copy)",
"drv.busy.login":"Signing in to Google…","drv.busy.save":"Saving to Drive…","drv.busy.open":"Opening from Drive…","drv.busy.refresh":"Refreshing the list…","drv.busy.delete":"Deleting…","drv.busy.psave":"Saving presets…","drv.busy.pload":"Loading presets…",
"drv.ok.saved":"Project saved to Google Drive","drv.ok.savedNew":"New file saved to Google Drive","drv.ok.forced":"Drive version overwritten","drv.ok.openedRemote":"Opened the version saved on Drive","drv.ok.opened":"Project opened from Google Drive","drv.ok.deleted":"File moved to the Drive trash","drv.ok.psaved":"Presets saved to Google Drive","drv.ok.ploaded":"Presets loaded from Google Drive","drv.ok.logout":"Signed out of Google. Your projects stay on Drive.","drv.ok.unlinked":"The project is no longer linked to the Drive file.","drv.ok.cid":"Client ID saved. You can now sign in with Google.",
"drv.err.cid":"The client ID must end with .apps.googleusercontent.com.",
"drv.err.auth":"The Google session has expired: press “Resume Google session”.",
"drv.err.conflict":"The file on Drive is newer than this version: choose whether to overwrite it or open the Drive one.",
"drv.err.closed":"Sign-in cancelled: the Google window was closed.",
"drv.err.popup":"The browser blocked the Google sign-in window. Allow pop-ups for this site and try again.",
"drv.err.gis":"Could not load the Google sign-in service. Check your connection.",
"drv.err.denied":"Google refused access{detail}. Check the client ID and the authorised origins.",
"drv.err.scope":"Saving needs permission to access the files created by the app. Try again and leave the Google Drive permission ticked.",
"drv.err.invalid":"The file is not a valid Stage Plan project.",
"drv.err.nopreset":"There are no presets saved on Drive yet.",
"drv.err.notfound":"The file no longer exists on Drive.",
"drv.err.forbidden":"Google denied the operation{detail}. Check that Google Drive API is enabled in the project.",
"drv.err.generic":"The operation failed{detail}. Check your connection.",
"drv.st.saved":"saved at {time}","drv.st.opened":"project opened from Drive","drv.st.linked":"linked","drv.st.expired":"session expired, tap to reconnect","drv.st.conflict":"conflict with another device","drv.st.error":"error","drv.st.saving":"saving","drv.st.unsaved":"changes not saved to Drive: tap to reconnect","drv.st.resumeLinked":"linked to “{name}”, tap to resume","drv.st.resume":"tap to resume the session",
"drv.toast.copied":"Address copied","drv.toast.noCopy":"Copying is not available: select it by hand","drv.toast.conflict":"Drive: the file was changed elsewhere, automatic saving paused"
},
it:{
"drv.title":"Google Drive","drv.btn":"Drive",
"drv.fileWarn":"Google non consente l’accesso da un file aperto sul computer. Pubblica l’app su un indirizzo https (per esempio con GitHub Pages) e aprila da lì.",
"drv.intro":"Salva progetti e preset nella cartella “{folder}” del tuo Google Drive e ritrovali su tutti i dispositivi. L’app può vedere solo i file che crea lei, non il resto del tuo Drive.",
"drv.login":"Accedi con Google","drv.resume":"Riprendi la sessione Google","drv.changeCid":"Cambia l’ID client Google",
"drv.setup.intro":"Per collegare l’app a Google Drive serve un “ID client” gratuito, da creare una sola volta nella console di Google Cloud con il tuo account.",
"drv.setup.steps":["Apri console.cloud.google.com e crea un nuovo progetto, per esempio “Stage Plan”.","In API e servizi › Libreria cerca Google Drive API e premi Abilita.","In Google Auth Platform (o “Schermata consenso OAuth”) configura l’app come Esterna: nome, email di assistenza e contatto.","In Accesso ai dati aggiungi l’ambito …/auth/drive.file.","In Pubblico premi Pubblica app, così potranno accedere tutti i musicisti e non solo gli utenti di test.","In Client crea un client di tipo Applicazione web e, in Origini JavaScript autorizzate, inserisci esattamente questo indirizzo:"],
"drv.setup.last":"Copia l’ID client (termina con .apps.googleusercontent.com) e incollalo qui sotto.",
"drv.cidLabel":"ID client Google","drv.saveCid":"Salva ID client","drv.copy":"Copia",
"drv.cidHint":"Per non farlo inserire a ogni musicista, chi pubblica l’app può scriverlo una volta per tutte in config.js oppure, su GitHub, nella variabile GOOGLE_CLIENT_ID del repository.",
"drv.signedIn":"Collegato come {who}","drv.logout":"Disconnetti",
"drv.current":"Progetto attuale",
"drv.conflict":"Il file “{name}” su Drive è stato modificato da un altro dispositivo ({date}). Il salvataggio automatico è sospeso.",
"drv.force":"Sovrascrivi con questa versione","drv.openRemote":"Apri la versione di Drive",
"drv.linked":"Collegato al file “{name}”.","drv.savedAt":"Salvato alle {time}.","drv.dirty":"Ci sono modifiche non ancora salvate.","drv.clean":"Nessuna modifica da salvare.",
"drv.notYet":"Questo progetto non è ancora su Drive.",
"drv.fileName":"Nome del file","drv.save":"Salva su Drive","drv.saveAs":"Salva come nuovo file","drv.unlink":"Scollega",
"drv.auto":"Salvataggio automatico su Drive a ogni modifica",
"drv.list":"Progetti su Drive","drv.refresh":"Aggiorna","drv.loading":"Caricamento dell’elenco…",
"drv.empty":"Nessun progetto salvato nella cartella “{folder}”.",
"drv.rowMeta":"modificato il {date}","drv.rowMetaCur":"aperto ora, modificato il {date}",
"drv.open":"Apri","drv.del":"Elimina","drv.confirm":"Conferma","drv.trashNote":"I file eliminati finiscono nel cestino di Drive per 30 giorni.",
"drv.presets":"Preset","drv.presetsHint":"Formazioni, disposizioni e palchi personalizzati viaggiano già dentro ogni progetto. Qui puoi salvarli o caricarli anche da soli, per averli su un altro dispositivo.",
"drv.psave":"Salva i preset su Drive","drv.pload":"Carica i preset da Drive",
"drv.unsavedOpen":"Il progetto attuale ha modifiche non salvate su Drive. Premi di nuovo “Apri” per continuare comunque.",
"drv.copySuffix":" (copia)",
"drv.busy.login":"Accesso a Google in corso…","drv.busy.save":"Salvataggio su Drive…","drv.busy.open":"Apertura da Drive…","drv.busy.refresh":"Aggiornamento elenco…","drv.busy.delete":"Eliminazione…","drv.busy.psave":"Salvataggio dei preset…","drv.busy.pload":"Caricamento dei preset…",
"drv.ok.saved":"Progetto salvato su Google Drive","drv.ok.savedNew":"Nuovo file salvato su Google Drive","drv.ok.forced":"Versione di Drive sovrascritta","drv.ok.openedRemote":"Aperta la versione salvata su Drive","drv.ok.opened":"Progetto aperto da Google Drive","drv.ok.deleted":"File spostato nel cestino di Drive","drv.ok.psaved":"Preset salvati su Google Drive","drv.ok.ploaded":"Preset caricati da Google Drive","drv.ok.logout":"Disconnesso da Google. I progetti restano su Drive.","drv.ok.unlinked":"Il progetto non è più collegato al file di Drive.","drv.ok.cid":"ID client salvato. Ora puoi accedere con Google.",
"drv.err.cid":"L’ID client deve terminare con .apps.googleusercontent.com.",
"drv.err.auth":"La sessione Google è scaduta: premi “Riprendi la sessione Google”.",
"drv.err.conflict":"Il file su Drive è più recente di questa versione: scegli se sovrascriverlo o aprire quello di Drive.",
"drv.err.closed":"Accesso annullato: la finestra di Google è stata chiusa.",
"drv.err.popup":"Il browser ha bloccato la finestra di accesso di Google. Consenti i popup per questo sito e riprova.",
"drv.err.gis":"Impossibile caricare il servizio di accesso di Google. Controlla la connessione.",
"drv.err.denied":"Google ha rifiutato l’accesso{detail}. Verifica l’ID client e le origini autorizzate.",
"drv.err.scope":"Per salvare serve il permesso di accedere ai file creati dall’app. Riprova e lascia attiva l’autorizzazione per Google Drive.",
"drv.err.invalid":"Il file non è un progetto valido.",
"drv.err.nopreset":"Su Drive non ci sono ancora preset salvati.",
"drv.err.notfound":"Il file non esiste più su Drive.",
"drv.err.forbidden":"Google ha negato l’operazione{detail}. Verifica che Google Drive API sia abilitata nel progetto.",
"drv.err.generic":"Operazione non riuscita{detail}. Controlla la connessione.",
"drv.st.saved":"salvato alle {time}","drv.st.opened":"progetto aperto da Drive","drv.st.linked":"collegato","drv.st.expired":"sessione scaduta, tocca per riconnetterti","drv.st.conflict":"conflitto con un altro dispositivo","drv.st.error":"errore","drv.st.saving":"salvataggio in corso","drv.st.unsaved":"modifiche non salvate su Drive: tocca per riconnetterti","drv.st.resumeLinked":"collegato a “{name}”, tocca per riprendere","drv.st.resume":"tocca per riprendere la sessione",
"drv.toast.copied":"Indirizzo copiato","drv.toast.noCopy":"Copia non disponibile: selezionalo a mano","drv.toast.conflict":"Drive: il file è stato modificato altrove, salvataggio automatico sospeso"
},
es:{
"drv.title":"Google Drive","drv.btn":"Drive",
"drv.fileWarn":"Google no permite iniciar sesión desde un archivo abierto en el ordenador. Publica la app en una dirección https (por ejemplo con GitHub Pages) y ábrela desde allí.",
"drv.intro":"Guarda proyectos y preajustes en la carpeta «{folder}» de tu Google Drive y encuéntralos en todos tus dispositivos. La app solo ve los archivos que crea ella, no el resto de tu Drive.",
"drv.login":"Iniciar sesión con Google","drv.resume":"Reanudar la sesión de Google","drv.changeCid":"Cambiar el ID de cliente de Google",
"drv.setup.intro":"Para conectar la app a Google Drive necesitas un «ID de cliente» gratuito, que se crea una sola vez en la consola de Google Cloud con tu cuenta.",
"drv.setup.steps":["Abre console.cloud.google.com y crea un proyecto nuevo, por ejemplo «Stage Plan».","En APIs y servicios › Biblioteca busca Google Drive API y pulsa Habilitar.","En Google Auth Platform (o «Pantalla de consentimiento de OAuth») configura la app como Externa: nombre, correo de asistencia y de contacto.","En Acceso a datos añade el permiso …/auth/drive.file.","En Público pulsa Publicar app, para que puedan entrar todos los músicos y no solo los usuarios de prueba.","En Clientes crea un cliente de tipo Aplicación web y, en Orígenes de JavaScript autorizados, escribe exactamente esta dirección:"],
"drv.setup.last":"Copia el ID de cliente (termina en .apps.googleusercontent.com) y pégalo abajo.",
"drv.cidLabel":"ID de cliente de Google","drv.saveCid":"Guardar ID de cliente","drv.copy":"Copiar",
"drv.cidHint":"Para que cada músico no tenga que hacerlo, quien publica la app puede escribirlo una vez en config.js o, en GitHub, en la variable GOOGLE_CLIENT_ID del repositorio.",
"drv.signedIn":"Sesión iniciada como {who}","drv.logout":"Cerrar sesión",
"drv.current":"Proyecto actual",
"drv.conflict":"El archivo «{name}» de Drive se modificó en otro dispositivo ({date}). El guardado automático está en pausa.",
"drv.force":"Sobrescribir con esta versión","drv.openRemote":"Abrir la versión de Drive",
"drv.linked":"Vinculado al archivo «{name}».","drv.savedAt":"Guardado a las {time}.","drv.dirty":"Hay cambios sin guardar.","drv.clean":"Nada que guardar.",
"drv.notYet":"Este proyecto aún no está en Drive.",
"drv.fileName":"Nombre del archivo","drv.save":"Guardar en Drive","drv.saveAs":"Guardar como archivo nuevo","drv.unlink":"Desvincular",
"drv.auto":"Guardar en Drive automáticamente tras cada cambio",
"drv.list":"Proyectos en Drive","drv.refresh":"Actualizar","drv.loading":"Cargando la lista…",
"drv.empty":"No hay proyectos guardados en la carpeta «{folder}».",
"drv.rowMeta":"modificado el {date}","drv.rowMetaCur":"abierto ahora, modificado el {date}",
"drv.open":"Abrir","drv.del":"Eliminar","drv.confirm":"Confirmar","drv.trashNote":"Los archivos eliminados quedan 30 días en la papelera de Drive.",
"drv.presets":"Preajustes","drv.presetsHint":"Las formaciones, disposiciones y escenarios personalizados ya viajan dentro de cada proyecto. Aquí también puedes guardarlos o cargarlos por separado, para usarlos en otro dispositivo.",
"drv.psave":"Guardar preajustes en Drive","drv.pload":"Cargar preajustes de Drive",
"drv.unsavedOpen":"El proyecto actual tiene cambios sin guardar en Drive. Pulsa «Abrir» otra vez para continuar de todos modos.",
"drv.copySuffix":" (copia)",
"drv.busy.login":"Iniciando sesión en Google…","drv.busy.save":"Guardando en Drive…","drv.busy.open":"Abriendo desde Drive…","drv.busy.refresh":"Actualizando la lista…","drv.busy.delete":"Eliminando…","drv.busy.psave":"Guardando preajustes…","drv.busy.pload":"Cargando preajustes…",
"drv.ok.saved":"Proyecto guardado en Google Drive","drv.ok.savedNew":"Archivo nuevo guardado en Google Drive","drv.ok.forced":"Versión de Drive sobrescrita","drv.ok.openedRemote":"Abierta la versión guardada en Drive","drv.ok.opened":"Proyecto abierto desde Google Drive","drv.ok.deleted":"Archivo enviado a la papelera de Drive","drv.ok.psaved":"Preajustes guardados en Google Drive","drv.ok.ploaded":"Preajustes cargados desde Google Drive","drv.ok.logout":"Sesión de Google cerrada. Tus proyectos siguen en Drive.","drv.ok.unlinked":"El proyecto ya no está vinculado al archivo de Drive.","drv.ok.cid":"ID de cliente guardado. Ya puedes iniciar sesión con Google.",
"drv.err.cid":"El ID de cliente debe terminar en .apps.googleusercontent.com.",
"drv.err.auth":"La sesión de Google ha caducado: pulsa «Reanudar la sesión de Google».",
"drv.err.conflict":"El archivo de Drive es más reciente que esta versión: elige si sobrescribirlo o abrir el de Drive.",
"drv.err.closed":"Inicio de sesión cancelado: se cerró la ventana de Google.",
"drv.err.popup":"El navegador bloqueó la ventana de inicio de sesión de Google. Permite las ventanas emergentes para este sitio y vuelve a intentarlo.",
"drv.err.gis":"No se pudo cargar el servicio de inicio de sesión de Google. Comprueba la conexión.",
"drv.err.denied":"Google denegó el acceso{detail}. Comprueba el ID de cliente y los orígenes autorizados.",
"drv.err.scope":"Para guardar hace falta permiso para acceder a los archivos creados por la app. Vuelve a intentarlo y deja marcado el permiso de Google Drive.",
"drv.err.invalid":"El archivo no es un proyecto válido.",
"drv.err.nopreset":"Todavía no hay preajustes guardados en Drive.",
"drv.err.notfound":"El archivo ya no existe en Drive.",
"drv.err.forbidden":"Google denegó la operación{detail}. Comprueba que Google Drive API esté habilitada en el proyecto.",
"drv.err.generic":"La operación ha fallado{detail}. Comprueba la conexión.",
"drv.st.saved":"guardado a las {time}","drv.st.opened":"proyecto abierto desde Drive","drv.st.linked":"vinculado","drv.st.expired":"sesión caducada, toca para reconectar","drv.st.conflict":"conflicto con otro dispositivo","drv.st.error":"error","drv.st.saving":"guardando","drv.st.unsaved":"cambios sin guardar en Drive: toca para reconectar","drv.st.resumeLinked":"vinculado a «{name}», toca para reanudar","drv.st.resume":"toca para reanudar la sesión",
"drv.toast.copied":"Dirección copiada","drv.toast.noCopy":"No se puede copiar: selecciónala a mano","drv.toast.conflict":"Drive: el archivo se modificó en otro lugar, guardado automático en pausa"
},
fr:{
"drv.title":"Google Drive","drv.btn":"Drive",
"drv.fileWarn":"Google n’autorise pas la connexion depuis un fichier ouvert sur l’ordinateur. Publiez l’application à une adresse https (par exemple avec GitHub Pages) et ouvrez-la depuis celle-ci.",
"drv.intro":"Enregistrez projets et préréglages dans le dossier « {folder} » de votre Google Drive et retrouvez-les sur tous vos appareils. L’application ne voit que les fichiers qu’elle crée, pas le reste de votre Drive.",
"drv.login":"Se connecter avec Google","drv.resume":"Reprendre la session Google","drv.changeCid":"Changer l’ID client Google",
"drv.setup.intro":"Pour relier l’application à Google Drive, il faut un « ID client » gratuit, à créer une seule fois dans la console Google Cloud avec votre compte.",
"drv.setup.steps":["Ouvrez console.cloud.google.com et créez un projet, par exemple « Stage Plan ».","Dans API et services › Bibliothèque, cherchez Google Drive API et cliquez sur Activer.","Dans Google Auth Platform (ou « Écran de consentement OAuth »), configurez l’application en Externe : nom, e-mail d’assistance et de contact.","Dans Accès aux données, ajoutez le champ d’application …/auth/drive.file.","Dans Audience, cliquez sur Publier l’application, pour que tous les musiciens puissent se connecter et pas seulement les testeurs.","Dans Clients, créez un client de type Application Web et, dans Origines JavaScript autorisées, saisissez exactement cette adresse :"],
"drv.setup.last":"Copiez l’ID client (il se termine par .apps.googleusercontent.com) et collez-le ci-dessous.",
"drv.cidLabel":"ID client Google","drv.saveCid":"Enregistrer l’ID client","drv.copy":"Copier",
"drv.cidHint":"Pour éviter cette étape à chaque musicien, la personne qui publie l’application peut l’écrire une fois pour toutes dans config.js ou, sur GitHub, dans la variable GOOGLE_CLIENT_ID du dépôt.",
"drv.signedIn":"Connecté en tant que {who}","drv.logout":"Se déconnecter",
"drv.current":"Projet actuel",
"drv.conflict":"Le fichier « {name} » sur Drive a été modifié depuis un autre appareil ({date}). L’enregistrement automatique est suspendu.",
"drv.force":"Écraser avec cette version","drv.openRemote":"Ouvrir la version de Drive",
"drv.linked":"Lié au fichier « {name} ».","drv.savedAt":"Enregistré à {time}.","drv.dirty":"Des modifications ne sont pas encore enregistrées.","drv.clean":"Rien à enregistrer.",
"drv.notYet":"Ce projet n’est pas encore sur Drive.",
"drv.fileName":"Nom du fichier","drv.save":"Enregistrer sur Drive","drv.saveAs":"Enregistrer comme nouveau fichier","drv.unlink":"Délier",
"drv.auto":"Enregistrer automatiquement sur Drive après chaque modification",
"drv.list":"Projets sur Drive","drv.refresh":"Actualiser","drv.loading":"Chargement de la liste…",
"drv.empty":"Aucun projet dans le dossier « {folder} ».",
"drv.rowMeta":"modifié le {date}","drv.rowMetaCur":"ouvert, modifié le {date}",
"drv.open":"Ouvrir","drv.del":"Supprimer","drv.confirm":"Confirmer","drv.trashNote":"Les fichiers supprimés restent 30 jours dans la corbeille de Drive.",
"drv.presets":"Préréglages","drv.presetsHint":"Les formations, placements et scènes personnalisés voyagent déjà dans chaque projet. Ici, vous pouvez aussi les enregistrer ou les charger seuls, pour les utiliser sur un autre appareil.",
"drv.psave":"Enregistrer les préréglages sur Drive","drv.pload":"Charger les préréglages depuis Drive",
"drv.unsavedOpen":"Le projet actuel contient des modifications non enregistrées sur Drive. Cliquez de nouveau sur « Ouvrir » pour continuer quand même.",
"drv.copySuffix":" (copie)",
"drv.busy.login":"Connexion à Google…","drv.busy.save":"Enregistrement sur Drive…","drv.busy.open":"Ouverture depuis Drive…","drv.busy.refresh":"Actualisation de la liste…","drv.busy.delete":"Suppression…","drv.busy.psave":"Enregistrement des préréglages…","drv.busy.pload":"Chargement des préréglages…",
"drv.ok.saved":"Projet enregistré sur Google Drive","drv.ok.savedNew":"Nouveau fichier enregistré sur Google Drive","drv.ok.forced":"Version de Drive écrasée","drv.ok.openedRemote":"Version enregistrée sur Drive ouverte","drv.ok.opened":"Projet ouvert depuis Google Drive","drv.ok.deleted":"Fichier placé dans la corbeille de Drive","drv.ok.psaved":"Préréglages enregistrés sur Google Drive","drv.ok.ploaded":"Préréglages chargés depuis Google Drive","drv.ok.logout":"Déconnecté de Google. Vos projets restent sur Drive.","drv.ok.unlinked":"Le projet n’est plus lié au fichier Drive.","drv.ok.cid":"ID client enregistré. Vous pouvez maintenant vous connecter avec Google.",
"drv.err.cid":"L’ID client doit se terminer par .apps.googleusercontent.com.",
"drv.err.auth":"La session Google a expiré : cliquez sur « Reprendre la session Google ».",
"drv.err.conflict":"Le fichier sur Drive est plus récent que cette version : choisissez de l’écraser ou d’ouvrir celui de Drive.",
"drv.err.closed":"Connexion annulée : la fenêtre Google a été fermée.",
"drv.err.popup":"Le navigateur a bloqué la fenêtre de connexion Google. Autorisez les fenêtres pop-up pour ce site et réessayez.",
"drv.err.gis":"Impossible de charger le service de connexion Google. Vérifiez votre connexion.",
"drv.err.denied":"Google a refusé l’accès{detail}. Vérifiez l’ID client et les origines autorisées.",
"drv.err.scope":"L’enregistrement nécessite l’accès aux fichiers créés par l’application. Réessayez en laissant cochée l’autorisation Google Drive.",
"drv.err.invalid":"Le fichier n’est pas un projet valide.",
"drv.err.nopreset":"Aucun préréglage n’est encore enregistré sur Drive.",
"drv.err.notfound":"Le fichier n’existe plus sur Drive.",
"drv.err.forbidden":"Google a refusé l’opération{detail}. Vérifiez que Google Drive API est activée dans le projet.",
"drv.err.generic":"L’opération a échoué{detail}. Vérifiez votre connexion.",
"drv.st.saved":"enregistré à {time}","drv.st.opened":"projet ouvert depuis Drive","drv.st.linked":"lié","drv.st.expired":"session expirée, touchez pour vous reconnecter","drv.st.conflict":"conflit avec un autre appareil","drv.st.error":"erreur","drv.st.saving":"enregistrement","drv.st.unsaved":"modifications non enregistrées sur Drive : touchez pour vous reconnecter","drv.st.resumeLinked":"lié à « {name} », touchez pour reprendre","drv.st.resume":"touchez pour reprendre la session",
"drv.toast.copied":"Adresse copiée","drv.toast.noCopy":"Copie impossible : sélectionnez-la à la main","drv.toast.conflict":"Drive : le fichier a été modifié ailleurs, enregistrement automatique suspendu"
},
de:{
"drv.title":"Google Drive","drv.btn":"Drive",
"drv.fileWarn":"Google erlaubt keine Anmeldung aus einer lokal geöffneten Datei. Veröffentlichen Sie die App unter einer https-Adresse (zum Beispiel mit GitHub Pages) und öffnen Sie sie dort.",
"drv.intro":"Speichern Sie Projekte und Vorlagen im Ordner „{folder}“ Ihres Google Drive und finden Sie sie auf allen Geräten wieder. Die App sieht nur die Dateien, die sie selbst anlegt, nicht den Rest Ihres Drive.",
"drv.login":"Mit Google anmelden","drv.resume":"Google-Sitzung fortsetzen","drv.changeCid":"Google-Client-ID ändern",
"drv.setup.intro":"Um die App mit Google Drive zu verbinden, brauchen Sie eine kostenlose „Client-ID“, die Sie einmalig in der Google-Cloud-Konsole mit Ihrem Konto anlegen.",
"drv.setup.steps":["Öffnen Sie console.cloud.google.com und legen Sie ein neues Projekt an, zum Beispiel „Stage Plan“.","Unter APIs und Dienste › Bibliothek nach Google Drive API suchen und Aktivieren drücken.","Unter Google Auth Platform (oder „OAuth-Zustimmungsbildschirm“) die App als Extern einrichten: Name, Support- und Kontakt-E-Mail.","Unter Datenzugriff den Bereich …/auth/drive.file hinzufügen.","Unter Zielgruppe auf App veröffentlichen klicken, damit sich alle Musiker anmelden können und nicht nur Testnutzer.","Unter Clients einen Client vom Typ Webanwendung anlegen und bei Autorisierte JavaScript-Quellen genau diese Adresse eintragen:"],
"drv.setup.last":"Kopieren Sie die Client-ID (sie endet auf .apps.googleusercontent.com) und fügen Sie sie unten ein.",
"drv.cidLabel":"Google-Client-ID","drv.saveCid":"Client-ID speichern","drv.copy":"Kopieren",
"drv.cidHint":"Damit nicht jeder Musiker diesen Schritt machen muss, kann die veröffentlichende Person sie einmal in config.js oder auf GitHub in der Repository-Variablen GOOGLE_CLIENT_ID eintragen.",
"drv.signedIn":"Angemeldet als {who}","drv.logout":"Abmelden",
"drv.current":"Aktuelles Projekt",
"drv.conflict":"Die Datei „{name}“ auf Drive wurde auf einem anderen Gerät geändert ({date}). Das automatische Speichern ist angehalten.",
"drv.force":"Mit dieser Version überschreiben","drv.openRemote":"Drive-Version öffnen",
"drv.linked":"Verknüpft mit der Datei „{name}“.","drv.savedAt":"Gespeichert um {time}.","drv.dirty":"Es gibt ungespeicherte Änderungen.","drv.clean":"Nichts zu speichern.",
"drv.notYet":"Dieses Projekt ist noch nicht auf Drive.",
"drv.fileName":"Dateiname","drv.save":"Auf Drive speichern","drv.saveAs":"Als neue Datei speichern","drv.unlink":"Verknüpfung lösen",
"drv.auto":"Nach jeder Änderung automatisch auf Drive speichern",
"drv.list":"Projekte auf Drive","drv.refresh":"Aktualisieren","drv.loading":"Liste wird geladen …",
"drv.empty":"Keine Projekte im Ordner „{folder}“.",
"drv.rowMeta":"geändert am {date}","drv.rowMetaCur":"jetzt geöffnet, geändert am {date}",
"drv.open":"Öffnen","drv.del":"Löschen","drv.confirm":"Bestätigen","drv.trashNote":"Gelöschte Dateien bleiben 30 Tage im Drive-Papierkorb.",
"drv.presets":"Vorlagen","drv.presetsHint":"Eigene Besetzungen, Aufstellungen und Bühnen reisen bereits in jedem Projekt mit. Hier können Sie sie auch einzeln speichern oder laden, um sie auf einem anderen Gerät zu nutzen.",
"drv.psave":"Vorlagen auf Drive speichern","drv.pload":"Vorlagen von Drive laden",
"drv.unsavedOpen":"Das aktuelle Projekt hat Änderungen, die nicht auf Drive gespeichert sind. Drücken Sie erneut „Öffnen“, um trotzdem fortzufahren.",
"drv.copySuffix":" (Kopie)",
"drv.busy.login":"Anmeldung bei Google …","drv.busy.save":"Speichern auf Drive …","drv.busy.open":"Öffnen von Drive …","drv.busy.refresh":"Liste wird aktualisiert …","drv.busy.delete":"Löschen …","drv.busy.psave":"Vorlagen werden gespeichert …","drv.busy.pload":"Vorlagen werden geladen …",
"drv.ok.saved":"Projekt auf Google Drive gespeichert","drv.ok.savedNew":"Neue Datei auf Google Drive gespeichert","drv.ok.forced":"Drive-Version überschrieben","drv.ok.openedRemote":"Auf Drive gespeicherte Version geöffnet","drv.ok.opened":"Projekt von Google Drive geöffnet","drv.ok.deleted":"Datei in den Drive-Papierkorb verschoben","drv.ok.psaved":"Vorlagen auf Google Drive gespeichert","drv.ok.ploaded":"Vorlagen von Google Drive geladen","drv.ok.logout":"Von Google abgemeldet. Ihre Projekte bleiben auf Drive.","drv.ok.unlinked":"Das Projekt ist nicht mehr mit der Drive-Datei verknüpft.","drv.ok.cid":"Client-ID gespeichert. Sie können sich jetzt mit Google anmelden.",
"drv.err.cid":"Die Client-ID muss auf .apps.googleusercontent.com enden.",
"drv.err.auth":"Die Google-Sitzung ist abgelaufen: Drücken Sie „Google-Sitzung fortsetzen“.",
"drv.err.conflict":"Die Datei auf Drive ist neuer als diese Version: Wählen Sie, ob Sie sie überschreiben oder die Drive-Version öffnen.",
"drv.err.closed":"Anmeldung abgebrochen: Das Google-Fenster wurde geschlossen.",
"drv.err.popup":"Der Browser hat das Google-Anmeldefenster blockiert. Erlauben Sie Pop-ups für diese Seite und versuchen Sie es erneut.",
"drv.err.gis":"Der Google-Anmeldedienst konnte nicht geladen werden. Prüfen Sie die Verbindung.",
"drv.err.denied":"Google hat den Zugriff verweigert{detail}. Prüfen Sie die Client-ID und die autorisierten Quellen.",
"drv.err.scope":"Zum Speichern braucht die App Zugriff auf die von ihr angelegten Dateien. Versuchen Sie es erneut und lassen Sie die Google-Drive-Berechtigung aktiviert.",
"drv.err.invalid":"Die Datei ist kein gültiges Projekt.",
"drv.err.nopreset":"Auf Drive sind noch keine Vorlagen gespeichert.",
"drv.err.notfound":"Die Datei existiert auf Drive nicht mehr.",
"drv.err.forbidden":"Google hat den Vorgang verweigert{detail}. Prüfen Sie, ob die Google Drive API im Projekt aktiviert ist.",
"drv.err.generic":"Der Vorgang ist fehlgeschlagen{detail}. Prüfen Sie die Verbindung.",
"drv.st.saved":"gespeichert um {time}","drv.st.opened":"Projekt von Drive geöffnet","drv.st.linked":"verknüpft","drv.st.expired":"Sitzung abgelaufen, zum Verbinden tippen","drv.st.conflict":"Konflikt mit einem anderen Gerät","drv.st.error":"Fehler","drv.st.saving":"wird gespeichert","drv.st.unsaved":"Änderungen nicht auf Drive gespeichert: zum Verbinden tippen","drv.st.resumeLinked":"verknüpft mit „{name}“, zum Fortsetzen tippen","drv.st.resume":"zum Fortsetzen der Sitzung tippen",
"drv.toast.copied":"Adresse kopiert","drv.toast.noCopy":"Kopieren nicht möglich: Bitte von Hand markieren","drv.toast.conflict":"Drive: Die Datei wurde anderswo geändert, automatisches Speichern angehalten"
},
pt:{
"drv.title":"Google Drive","drv.btn":"Drive",
"drv.fileWarn":"O Google não permite entrar a partir de um arquivo aberto no computador. Publique o app num endereço https (por exemplo com o GitHub Pages) e abra-o por lá.",
"drv.intro":"Salve projetos e predefinições na pasta “{folder}” do seu Google Drive e encontre-os em todos os dispositivos. O app só vê os arquivos que ele mesmo cria, não o resto do seu Drive.",
"drv.login":"Entrar com o Google","drv.resume":"Retomar a sessão do Google","drv.changeCid":"Alterar o ID do cliente Google",
"drv.setup.intro":"Para ligar o app ao Google Drive é preciso um “ID do cliente” gratuito, criado uma única vez no console do Google Cloud com a sua conta.",
"drv.setup.steps":["Abra console.cloud.google.com e crie um novo projeto, por exemplo “Stage Plan”.","Em APIs e serviços › Biblioteca, procure Google Drive API e clique em Ativar.","Em Google Auth Platform (ou “Tela de permissão OAuth”), configure o app como Externo: nome, e-mail de suporte e de contato.","Em Acesso a dados, adicione o escopo …/auth/drive.file.","Em Público-alvo, clique em Publicar app, para que todos os músicos possam entrar e não só os usuários de teste.","Em Clientes, crie um cliente do tipo Aplicativo da Web e, em Origens JavaScript autorizadas, digite exatamente este endereço:"],
"drv.setup.last":"Copie o ID do cliente (termina em .apps.googleusercontent.com) e cole-o abaixo.",
"drv.cidLabel":"ID do cliente Google","drv.saveCid":"Salvar ID do cliente","drv.copy":"Copiar",
"drv.cidHint":"Para que cada músico não precise fazer isso, quem publica o app pode escrevê-lo uma vez em config.js ou, no GitHub, na variável GOOGLE_CLIENT_ID do repositório.",
"drv.signedIn":"Conectado como {who}","drv.logout":"Sair",
"drv.current":"Projeto atual",
"drv.conflict":"O arquivo “{name}” no Drive foi alterado em outro dispositivo ({date}). O salvamento automático está pausado.",
"drv.force":"Sobrescrever com esta versão","drv.openRemote":"Abrir a versão do Drive",
"drv.linked":"Ligado ao arquivo “{name}”.","drv.savedAt":"Salvo às {time}.","drv.dirty":"Há alterações não salvas.","drv.clean":"Nada a salvar.",
"drv.notYet":"Este projeto ainda não está no Drive.",
"drv.fileName":"Nome do arquivo","drv.save":"Salvar no Drive","drv.saveAs":"Salvar como novo arquivo","drv.unlink":"Desligar",
"drv.auto":"Salvar automaticamente no Drive após cada alteração",
"drv.list":"Projetos no Drive","drv.refresh":"Atualizar","drv.loading":"Carregando a lista…",
"drv.empty":"Nenhum projeto salvo na pasta “{folder}”.",
"drv.rowMeta":"alterado em {date}","drv.rowMetaCur":"aberto agora, alterado em {date}",
"drv.open":"Abrir","drv.del":"Excluir","drv.confirm":"Confirmar","drv.trashNote":"Os arquivos excluídos ficam 30 dias na lixeira do Drive.",
"drv.presets":"Predefinições","drv.presetsHint":"Formações, disposições e palcos personalizados já vão dentro de cada projeto. Aqui você também pode salvá-los ou carregá-los separadamente, para usá-los em outro dispositivo.",
"drv.psave":"Salvar predefinições no Drive","drv.pload":"Carregar predefinições do Drive",
"drv.unsavedOpen":"O projeto atual tem alterações não salvas no Drive. Clique de novo em “Abrir” para continuar mesmo assim.",
"drv.copySuffix":" (cópia)",
"drv.busy.login":"Entrando no Google…","drv.busy.save":"Salvando no Drive…","drv.busy.open":"Abrindo do Drive…","drv.busy.refresh":"Atualizando a lista…","drv.busy.delete":"Excluindo…","drv.busy.psave":"Salvando predefinições…","drv.busy.pload":"Carregando predefinições…",
"drv.ok.saved":"Projeto salvo no Google Drive","drv.ok.savedNew":"Novo arquivo salvo no Google Drive","drv.ok.forced":"Versão do Drive sobrescrita","drv.ok.openedRemote":"Aberta a versão salva no Drive","drv.ok.opened":"Projeto aberto do Google Drive","drv.ok.deleted":"Arquivo movido para a lixeira do Drive","drv.ok.psaved":"Predefinições salvas no Google Drive","drv.ok.ploaded":"Predefinições carregadas do Google Drive","drv.ok.logout":"Você saiu do Google. Seus projetos continuam no Drive.","drv.ok.unlinked":"O projeto não está mais ligado ao arquivo do Drive.","drv.ok.cid":"ID do cliente salvo. Agora você pode entrar com o Google.",
"drv.err.cid":"O ID do cliente deve terminar em .apps.googleusercontent.com.",
"drv.err.auth":"A sessão do Google expirou: clique em “Retomar a sessão do Google”.",
"drv.err.conflict":"O arquivo no Drive é mais recente que esta versão: escolha se quer sobrescrevê-lo ou abrir o do Drive.",
"drv.err.closed":"Entrada cancelada: a janela do Google foi fechada.",
"drv.err.popup":"O navegador bloqueou a janela de entrada do Google. Permita pop-ups para este site e tente de novo.",
"drv.err.gis":"Não foi possível carregar o serviço de entrada do Google. Verifique a conexão.",
"drv.err.denied":"O Google recusou o acesso{detail}. Verifique o ID do cliente e as origens autorizadas.",
"drv.err.scope":"Para salvar é preciso permissão para acessar os arquivos criados pelo app. Tente de novo e deixe marcada a permissão do Google Drive.",
"drv.err.invalid":"O arquivo não é um projeto válido.",
"drv.err.nopreset":"Ainda não há predefinições salvas no Drive.",
"drv.err.notfound":"O arquivo não existe mais no Drive.",
"drv.err.forbidden":"O Google negou a operação{detail}. Verifique se a Google Drive API está ativada no projeto.",
"drv.err.generic":"A operação falhou{detail}. Verifique a conexão.",
"drv.st.saved":"salvo às {time}","drv.st.opened":"projeto aberto do Drive","drv.st.linked":"ligado","drv.st.expired":"sessão expirada, toque para reconectar","drv.st.conflict":"conflito com outro dispositivo","drv.st.error":"erro","drv.st.saving":"salvando","drv.st.unsaved":"alterações não salvas no Drive: toque para reconectar","drv.st.resumeLinked":"ligado a “{name}”, toque para retomar","drv.st.resume":"toque para retomar a sessão",
"drv.toast.copied":"Endereço copiado","drv.toast.noCopy":"Não é possível copiar: selecione à mão","drv.toast.conflict":"Drive: o arquivo foi alterado em outro lugar, salvamento automático pausado"
},
ja:{
"drv.title":"Google ドライブ","drv.btn":"ドライブ",
"drv.fileWarn":"パソコン上で開いたファイルからは Google にログインできません。アプリを https のアドレス（GitHub Pages など）で公開し、そこから開いてください。",
"drv.intro":"プロジェクトとプリセットを Google ドライブの「{folder}」フォルダに保存し、どの端末からでも開けます。アプリが見られるのは自分で作成したファイルだけで、ドライブのほかの内容は見られません。",
"drv.login":"Google でログイン","drv.resume":"Google セッションを再開","drv.changeCid":"Google クライアント ID を変更",
"drv.setup.intro":"アプリを Google ドライブに接続するには、無料の「クライアント ID」が必要です。ご自身のアカウントで Google Cloud コンソールから一度だけ作成します。",
"drv.setup.steps":["console.cloud.google.com を開き、「Stage Plan」などの名前で新しいプロジェクトを作成します。","「API とサービス › ライブラリ」で Google Drive API を検索し、「有効にする」を押します。","Google Auth Platform（または「OAuth 同意画面」）でアプリを「外部」として設定し、名前、サポート用メール、連絡先を入力します。","「データアクセス」でスコープ …/auth/drive.file を追加します。","「対象」で「アプリを公開」を押します。テストユーザー以外の奏者もログインできるようになります。","「クライアント」で種類「ウェブ アプリケーション」のクライアントを作成し、「承認済みの JavaScript 生成元」に次のアドレスを正確に入力します。"],
"drv.setup.last":"クライアント ID（末尾が .apps.googleusercontent.com）をコピーし、下に貼り付けてください。",
"drv.cidLabel":"Google クライアント ID","drv.saveCid":"クライアント ID を保存","drv.copy":"コピー",
"drv.cidHint":"奏者一人ひとりが入力しなくて済むよう、アプリを公開する人が config.js、または GitHub のリポジトリ変数 GOOGLE_CLIENT_ID に一度だけ書き込めます。",
"drv.signedIn":"{who} でログイン中","drv.logout":"ログアウト",
"drv.current":"現在のプロジェクト",
"drv.conflict":"ドライブ上のファイル「{name}」が別の端末で変更されました（{date}）。自動保存を一時停止しています。",
"drv.force":"このバージョンで上書き","drv.openRemote":"ドライブのバージョンを開く",
"drv.linked":"ファイル「{name}」にリンク中。","drv.savedAt":"{time} に保存。","drv.dirty":"未保存の変更があります。","drv.clean":"保存する変更はありません。",
"drv.notYet":"このプロジェクトはまだドライブにありません。",
"drv.fileName":"ファイル名","drv.save":"ドライブに保存","drv.saveAs":"新しいファイルとして保存","drv.unlink":"リンクを解除",
"drv.auto":"変更のたびにドライブへ自動保存",
"drv.list":"ドライブ上のプロジェクト","drv.refresh":"更新","drv.loading":"一覧を読み込み中…",
"drv.empty":"「{folder}」フォルダにプロジェクトはありません。",
"drv.rowMeta":"{date} に変更","drv.rowMetaCur":"表示中、{date} に変更",
"drv.open":"開く","drv.del":"削除","drv.confirm":"確定","drv.trashNote":"削除したファイルは 30 日間ドライブのゴミ箱に残ります。",
"drv.presets":"プリセット","drv.presetsHint":"カスタムの編成・配置・ステージは各プロジェクトに含まれています。ここでは別の端末で使うために、プリセットだけを保存・読み込みすることもできます。",
"drv.psave":"プリセットをドライブに保存","drv.pload":"ドライブからプリセットを読み込む",
"drv.unsavedOpen":"現在のプロジェクトにはドライブに保存していない変更があります。それでも続ける場合はもう一度「開く」を押してください。",
"drv.copySuffix":"（コピー）",
"drv.busy.login":"Google にログイン中…","drv.busy.save":"ドライブに保存中…","drv.busy.open":"ドライブから開いています…","drv.busy.refresh":"一覧を更新中…","drv.busy.delete":"削除中…","drv.busy.psave":"プリセットを保存中…","drv.busy.pload":"プリセットを読み込み中…",
"drv.ok.saved":"プロジェクトを Google ドライブに保存しました","drv.ok.savedNew":"新しいファイルを Google ドライブに保存しました","drv.ok.forced":"ドライブのバージョンを上書きしました","drv.ok.openedRemote":"ドライブに保存されたバージョンを開きました","drv.ok.opened":"Google ドライブからプロジェクトを開きました","drv.ok.deleted":"ファイルをドライブのゴミ箱に移動しました","drv.ok.psaved":"プリセットを Google ドライブに保存しました","drv.ok.ploaded":"Google ドライブからプリセットを読み込みました","drv.ok.logout":"Google からログアウトしました。プロジェクトはドライブに残っています。","drv.ok.unlinked":"プロジェクトとドライブのファイルのリンクを解除しました。","drv.ok.cid":"クライアント ID を保存しました。Google でログインできます。",
"drv.err.cid":"クライアント ID の末尾は .apps.googleusercontent.com である必要があります。",
"drv.err.auth":"Google セッションの有効期限が切れました。「Google セッションを再開」を押してください。",
"drv.err.conflict":"ドライブ上のファイルの方が新しいです。上書きするか、ドライブのファイルを開くか選んでください。",
"drv.err.closed":"ログインをキャンセルしました。Google のウィンドウが閉じられました。",
"drv.err.popup":"ブラウザが Google のログインウィンドウをブロックしました。このサイトのポップアップを許可して再試行してください。",
"drv.err.gis":"Google のログインサービスを読み込めませんでした。接続を確認してください。",
"drv.err.denied":"Google がアクセスを拒否しました{detail}。クライアント ID と承認済みの生成元を確認してください。",
"drv.err.scope":"保存するには、アプリが作成したファイルへのアクセス許可が必要です。Google ドライブの許可をオンにしたまま再試行してください。",
"drv.err.invalid":"このファイルは有効なプロジェクトではありません。",
"drv.err.nopreset":"ドライブにはまだプリセットが保存されていません。",
"drv.err.notfound":"このファイルはドライブ上にもうありません。",
"drv.err.forbidden":"Google が操作を拒否しました{detail}。プロジェクトで Google Drive API が有効になっているか確認してください。",
"drv.err.generic":"操作に失敗しました{detail}。接続を確認してください。",
"drv.st.saved":"{time} に保存","drv.st.opened":"ドライブから開いたプロジェクト","drv.st.linked":"リンク中","drv.st.expired":"セッション切れ。タップで再接続","drv.st.conflict":"別の端末との競合","drv.st.error":"エラー","drv.st.saving":"保存中","drv.st.unsaved":"ドライブに未保存の変更：タップで再接続","drv.st.resumeLinked":"「{name}」にリンク中。タップで再開","drv.st.resume":"タップでセッションを再開",
"drv.toast.copied":"アドレスをコピーしました","drv.toast.noCopy":"コピーできません。手動で選択してください","drv.toast.conflict":"ドライブ：別の場所でファイルが変更されたため、自動保存を停止しました"
},
zh:{
"drv.title":"Google 云端硬盘","drv.btn":"云端硬盘",
"drv.fileWarn":"Google 不允许从电脑上打开的本地文件登录。请将应用发布到 https 地址（例如 GitHub Pages）后再从那里打开。",
"drv.intro":"将项目和预设保存到 Google 云端硬盘的“{folder}”文件夹，在所有设备上都能找到。应用只能看到它自己创建的文件，看不到云端硬盘里的其他内容。",
"drv.login":"使用 Google 登录","drv.resume":"恢复 Google 会话","drv.changeCid":"更改 Google 客户端 ID",
"drv.setup.intro":"要将应用连接到 Google 云端硬盘，需要一个免费的“客户端 ID”，用你的账号在 Google Cloud 控制台中创建一次即可。",
"drv.setup.steps":["打开 console.cloud.google.com 并新建一个项目，例如“Stage Plan”。","在“API 和服务 › 库”中搜索 Google Drive API 并点击“启用”。","在 Google Auth Platform（或“OAuth 同意屏幕”）中将应用设为“外部”：填写名称、支持邮箱和联系邮箱。","在“数据访问”中添加范围 …/auth/drive.file。","在“目标对象”中点击“发布应用”，这样所有乐手都能登录，而不只是测试用户。","在“客户端”中创建类型为“Web 应用”的客户端，并在“已获授权的 JavaScript 来源”中准确填写以下地址："],
"drv.setup.last":"复制客户端 ID（以 .apps.googleusercontent.com 结尾），粘贴到下方。",
"drv.cidLabel":"Google 客户端 ID","drv.saveCid":"保存客户端 ID","drv.copy":"复制",
"drv.cidHint":"为免每位乐手都要操作，发布应用的人可以把它一次性写入 config.js，或写入 GitHub 仓库变量 GOOGLE_CLIENT_ID。",
"drv.signedIn":"已登录：{who}","drv.logout":"退出登录",
"drv.current":"当前项目",
"drv.conflict":"云端硬盘上的文件“{name}”已在其他设备上修改（{date}）。自动保存已暂停。",
"drv.force":"用此版本覆盖","drv.openRemote":"打开云端硬盘上的版本",
"drv.linked":"已关联文件“{name}”。","drv.savedAt":"保存于 {time}。","drv.dirty":"有尚未保存的更改。","drv.clean":"没有需要保存的更改。",
"drv.notYet":"此项目尚未保存到云端硬盘。",
"drv.fileName":"文件名","drv.save":"保存到云端硬盘","drv.saveAs":"另存为新文件","drv.unlink":"取消关联",
"drv.auto":"每次修改后自动保存到云端硬盘",
"drv.list":"云端硬盘上的项目","drv.refresh":"刷新","drv.loading":"正在加载列表…",
"drv.empty":"“{folder}”文件夹中没有项目。",
"drv.rowMeta":"修改于 {date}","drv.rowMetaCur":"当前打开，修改于 {date}",
"drv.open":"打开","drv.del":"删除","drv.confirm":"确认","drv.trashNote":"删除的文件会在云端硬盘回收站保留 30 天。",
"drv.presets":"预设","drv.presetsHint":"自定义的编制、排位和舞台已包含在每个项目中。你也可以在这里单独保存或加载它们，以便在其他设备上使用。",
"drv.psave":"将预设保存到云端硬盘","drv.pload":"从云端硬盘加载预设",
"drv.unsavedOpen":"当前项目有未保存到云端硬盘的更改。如仍要继续，请再次点击“打开”。",
"drv.copySuffix":"（副本）",
"drv.busy.login":"正在登录 Google…","drv.busy.save":"正在保存到云端硬盘…","drv.busy.open":"正在从云端硬盘打开…","drv.busy.refresh":"正在刷新列表…","drv.busy.delete":"正在删除…","drv.busy.psave":"正在保存预设…","drv.busy.pload":"正在加载预设…",
"drv.ok.saved":"项目已保存到 Google 云端硬盘","drv.ok.savedNew":"新文件已保存到 Google 云端硬盘","drv.ok.forced":"已覆盖云端硬盘上的版本","drv.ok.openedRemote":"已打开云端硬盘上保存的版本","drv.ok.opened":"已从 Google 云端硬盘打开项目","drv.ok.deleted":"文件已移到云端硬盘回收站","drv.ok.psaved":"预设已保存到 Google 云端硬盘","drv.ok.ploaded":"已从 Google 云端硬盘加载预设","drv.ok.logout":"已退出 Google。你的项目仍保存在云端硬盘中。","drv.ok.unlinked":"项目已不再关联云端硬盘文件。","drv.ok.cid":"客户端 ID 已保存。现在可以使用 Google 登录。",
"drv.err.cid":"客户端 ID 必须以 .apps.googleusercontent.com 结尾。",
"drv.err.auth":"Google 会话已过期：请点击“恢复 Google 会话”。",
"drv.err.conflict":"云端硬盘上的文件比此版本更新：请选择覆盖它，或打开云端硬盘上的版本。",
"drv.err.closed":"已取消登录：Google 窗口已关闭。",
"drv.err.popup":"浏览器拦截了 Google 登录窗口。请允许此网站的弹出窗口后重试。",
"drv.err.gis":"无法加载 Google 登录服务。请检查网络连接。",
"drv.err.denied":"Google 拒绝了访问{detail}。请检查客户端 ID 和已授权的来源。",
"drv.err.scope":"保存需要访问应用所创建文件的权限。请重试，并保持勾选 Google 云端硬盘权限。",
"drv.err.invalid":"此文件不是有效的项目。",
"drv.err.nopreset":"云端硬盘上还没有保存预设。",
"drv.err.notfound":"该文件已不在云端硬盘上。",
"drv.err.forbidden":"Google 拒绝了此操作{detail}。请确认项目中已启用 Google Drive API。",
"drv.err.generic":"操作失败{detail}。请检查网络连接。",
"drv.st.saved":"保存于 {time}","drv.st.opened":"已从云端硬盘打开项目","drv.st.linked":"已关联","drv.st.expired":"会话已过期，点按以重新连接","drv.st.conflict":"与其他设备冲突","drv.st.error":"错误","drv.st.saving":"正在保存","drv.st.unsaved":"更改未保存到云端硬盘：点按以重新连接","drv.st.resumeLinked":"已关联“{name}”，点按以继续","drv.st.resume":"点按以恢复会话",
"drv.toast.copied":"地址已复制","drv.toast.noCopy":"无法复制：请手动选择","drv.toast.conflict":"云端硬盘：文件已在别处修改，自动保存已暂停"
}
};
for(const [lang, dict] of Object.entries(DRV)) if(I18N[lang]) Object.assign(I18N[lang], dict);

/* ---------- configuration and state ---------- */
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const FOLDER = "Stage Plan";
const PRESET_FILE = "Stage Plan presets.json";
const API = "https://www.googleapis.com/drive/v3/";
const UPLOAD = "https://www.googleapis.com/upload/drive/v3/";
const K = {cid:"stageplan-drive-clientid", link:"stageplan-drive-link", folder:"stageplan-drive-folder", auto:"stageplan-drive-auto", was:"stageplan-drive-connected"};
const OLD_K = {cid:"pd-drive-clientid", link:"pd-drive-link", folder:"pd-drive-folder", auto:"pd-drive-auto", was:"pd-drive-connected"};
const ls = {
  get(k){ try{ const v = localStorage.getItem(K[k]); if(v!==null) return v; const o = localStorage.getItem(OLD_K[k]); if(o!==null){ localStorage.setItem(K[k], o); } return o; }catch(e){ return null; } },
  set(k,v){ try{ v==null ? localStorage.removeItem(K[k]) : localStorage.setItem(K[k],v); }catch(e){} }
};
const cfg = window.STAGEPLAN_CONFIG || {};
const clientId = ()=> String(cfg.googleClientId||"").trim() || String(ls.get("cid")||"").trim();
let savedLink = null; try{ savedLink = JSON.parse(ls.get("link")||"null"); }catch(e){}

const D = {
  tok:null, exp:0, tc:null, pending:null, gis:null,
  user:null, folderId:ls.get("folder"), link:savedLink, auto: ls.get("auto")!=="0",
  files:null, busy:"", msg:"", msgKind:"", conflict:null, confirmDel:null,
  lastSnap:null, timer:null, opening:false, status:"off", statusKey:"", statusArg:null
};

/* ---------- interface ---------- */
const CLOUD = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 15.5h8.5a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 5.3 9.6 3 3 0 0 0 6 15.5z"/></svg>`;
const css = document.createElement("style");
css.textContent = `
.dr-ico{ position:relative; display:inline-flex; }
.dr-dot{ position:absolute; right:-3px; bottom:-2px; width:8px; height:8px; border-radius:50%; background:transparent; border:1.5px solid var(--panel); }
.dr-dot.ok{ background:var(--ok); } .dr-dot.saving{ background:var(--accent); } .dr-dot.warn{ background:var(--caution); } .dr-dot.err{ background:var(--warn); } .dr-dot.idle{ background:var(--muted); }
.dr-sec{ margin-top:14px; padding-top:12px; border-top:1px solid var(--line); }
.dr-sec h3{ margin:0 0 8px; font-family:var(--cond); font-size:16px; display:flex; align-items:center; gap:8px; }
.dr-sec h3 .linkbtn{ margin-left:auto; font-family:var(--ui); }
.dr-acc{ display:flex; align-items:center; gap:10px; font-size:13.5px; flex-wrap:wrap; }
.dr-acc .linkbtn{ margin-left:auto; }
.dr-list{ border:1px solid var(--line); border-radius:8px; overflow:hidden; }
.dr-row{ display:flex; align-items:center; gap:8px; padding:8px 10px; border-bottom:1px solid var(--line); font-size:13.5px; }
.dr-row:last-child{ border-bottom:0; }
.dr-row.cur{ background:var(--accent-soft); }
.dr-row .nm{ flex:1; min-width:0; }
.dr-row .nm b{ display:block; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dr-row .nm small{ color:var(--muted); }
.dr-row .btn{ height:28px; padding:0 10px; }
.dr-msg{ border-radius:8px; padding:8px 10px; font-size:13px; margin-top:10px; border:1px solid var(--line); }
.dr-msg.err{ border-color:var(--warn); background:color-mix(in srgb, var(--warn) 10%, transparent); }
.dr-msg.ok{ border-color:var(--ok); background:color-mix(in srgb, var(--ok) 10%, transparent); }
.dr-msg.warn{ border-color:var(--caution); background:color-mix(in srgb, var(--caution) 10%, transparent); }
.dr-code{ display:flex; gap:6px; align-items:center; margin:6px 0; }
.dr-code code{ flex:1; background:var(--panel2); border:1px solid var(--line); border-radius:6px; padding:6px 8px; font-size:12.5px; overflow:auto; white-space:nowrap; }
.dr-steps{ padding-left:20px; font-size:13.5px; margin:6px 0 10px; }
.dr-steps li{ margin-bottom:5px; }
.gbtn{ display:inline-flex; align-items:center; gap:10px; height:40px; padding:0 16px; border:1px solid var(--line); border-radius:20px; background:#fff; color:#1f1f1f; font-weight:600; font-size:14px; }
.gbtn svg{ width:18px; height:18px; }
@media (max-width:599px){ .tools.more-open #bDrive .tl{ display:inline; } }
`;
document.head.appendChild(css);

const btn = document.createElement("button");
btn.className = "tb sec2"; btn.id = "bDrive";
btn.innerHTML = `<span class="dr-ico">${CLOUD}<i class="dr-dot" id="drDot"></i></span><span class="tl" id="drBtnLabel"></span>`;
const helpBtn = document.getElementById("bHelp");
helpBtn.parentNode.insertBefore(btn, helpBtn);

const modal = document.createElement("div");
modal.className = "modal"; modal.id = "driveModal";
modal.setAttribute("role","dialog"); modal.setAttribute("aria-modal","true"); modal.setAttribute("aria-labelledby","drT");
modal.innerHTML = `<div class="box wide" id="driveBox"></div>`;
document.body.appendChild(modal);
const box = modal.querySelector("#driveBox");

const G_LOGO = `<svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`;

const fmtDate = iso=>{ try{ return new Date(iso).toLocaleString(loc(),{dateStyle:"short",timeStyle:"short"}); }catch(e){ return ""; } };
const fmtTime = ms=>{ try{ return new Date(ms).toLocaleTimeString(loc(),{hour:"2-digit",minute:"2-digit"}); }catch(e){ return ""; } };
const stripExt = n => String(n||"").replace(/\.json$/i,"");
const cleanName = n => String(n||"").replace(/[\\/:*?"<>|]+/g," ").replace(/\s+/g," ").trim().slice(0,100);
const defaultName = ()=> cleanName(`${curFormName()} ${new Date().toLocaleDateString(loc()).replace(/\//g,"-")}`);
function setLink(l){ D.link = l; D.idleLink = null; ls.set("link", l ? JSON.stringify(l) : null); }
/* the status is stored as a key so it can be re-rendered when the language changes */
function setStatus(kind, key, arg){
  D.status = kind; D.statusKey = key||""; D.statusArg = arg||null;
  document.getElementById("drDot").className = "dr-dot" + (kind && kind!=="off" ? " "+kind : "");
  btn.title = t("drv.title") + (key ? ": " + t(key, arg) : "");
}
function setMsg(kind, key, arg){ D.msgKind = kind; D.msg = key ? {key, arg} : ""; }
const dirty = ()=> D.lastSnap!==null && snap()!==D.lastSnap;
function detail(e){ return e && e.message ? ` (${e.message})` : (e && e.status ? ` (HTTP ${e.status})` : ""); }

function render(){
  document.getElementById("drBtnLabel").textContent = t("drv.btn");
  btn.title = t("drv.title") + (D.statusKey ? ": " + t(D.statusKey, D.statusArg) : "");
  if(!modal.classList.contains("on")) return;
  const st = box.scrollTop;
  let h = `<h2 id="drT">${esc(t("drv.title"))}</h2>`;
  if(location.protocol==="file:") h += `<div class="dr-msg warn">${esc(t("drv.fileWarn"))}</div>`;
  if(!clientId()) h += setupHTML();
  else if(!D.tok){
    h += `<p class="hint">${esc(t("drv.intro",{folder:FOLDER}))}</p>
      <div class="btnrow" style="justify-content:flex-start"><button class="gbtn" data-d="login">${G_LOGO}${esc(t(ls.get("was")?"drv.resume":"drv.login"))}</button></div>
      ${D.busy?`<p class="hint" style="margin-top:8px">${esc(t(D.busy))}</p>`:""}
      ${cfg.googleClientId?"":`<p class="hint" style="margin-top:12px"><button class="linkbtn" data-d="resetcid">${esc(t("drv.changeCid"))}</button></p>`}`;
  } else h += connectedHTML();
  if(D.msg) h += `<div class="dr-msg ${D.msgKind}">${esc(t(D.msg.key, D.msg.arg))}</div>`;
  h += `<div class="btnrow" style="margin-top:16px"><button class="btn" data-d="close">${esc(t("btn.close"))}</button></div>`;
  box.innerHTML = h; box.scrollTop = st;
}
function setupHTML(){
  const steps = t("drv.setup.steps") || [];
  return `<p class="hint">${esc(t("drv.setup.intro"))}</p>
    <ol class="dr-steps">${steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
    <div class="dr-code"><code>${esc(location.origin)}</code><button class="btn" data-d="copyorigin">${esc(t("drv.copy"))}</button></div>
    <ol class="dr-steps" start="${steps.length+1}"><li>${esc(t("drv.setup.last"))}</li></ol>
    <label class="mini">${esc(t("drv.cidLabel"))}<input class="inp" id="drCid" placeholder="123456789-abc….apps.googleusercontent.com" autocomplete="off" spellcheck="false"></label>
    <div class="btnrow"><button class="btn primary" data-d="savecid">${esc(t("drv.saveCid"))}</button></div>
    <p class="hint" style="margin-top:10px">${esc(t("drv.cidHint"))}</p>`;
}
function connectedHTML(){
  const L = D.link, u = D.user;
  let h = `<div class="dr-acc">${G_LOGO.replace("<svg","<svg width=\"18\" height=\"18\"")}<span>${esc(t("drv.signedIn",{who: u ? (u.emailAddress||u.displayName||"") : "…"}))}</span><button class="linkbtn" data-d="logout">${esc(t("drv.logout"))}</button></div>`;
  h += `<div class="dr-sec"><h3>${esc(t("drv.current"))}</h3>`;
  if(D.conflict){
    h += `<div class="dr-msg warn" style="margin:0 0 10px">${esc(t("drv.conflict",{name:L?L.name:"", date:fmtDate(D.conflict.remote)}))}
      <div class="btnrow"><button class="btn" data-d="force">${esc(t("drv.force"))}</button><button class="btn" data-d="openlinked">${esc(t("drv.openRemote"))}</button></div></div>`;
  }
  if(L) h += `<p class="hint">${esc(t("drv.linked",{name:L.name}))} ${L.at?esc(t("drv.savedAt",{time:fmtTime(L.at)})):""} ${esc(t(dirty()?"drv.dirty":"drv.clean"))}</p>`;
  else h += `<p class="hint">${esc(t("drv.notYet"))}</p>`;
  h += `<label class="mini">${esc(t("drv.fileName"))}<input class="inp" id="drName" value="${esc(L?L.name:defaultName())}" maxlength="100"></label>
    <div class="btnrow"><button class="btn primary" data-d="save">${esc(t("drv.save"))}</button>${L?`<button class="btn" data-d="saveas">${esc(t("drv.saveAs"))}</button><button class="btn" data-d="unlink">${esc(t("drv.unlink"))}</button>`:""}</div>`;
  if(L) h += `<label class="toggle" style="margin-top:8px"><input type="checkbox" data-d="auto" ${D.auto?"checked":""}> ${esc(t("drv.auto"))}</label>`;
  h += `</div><div class="dr-sec"><h3>${esc(t("drv.list"))}<button class="linkbtn" data-d="refresh">${esc(t("drv.refresh"))}</button></h3>`;
  if(D.files===null) h += `<p class="hint">${esc(t("drv.loading"))}</p>`;
  else if(!D.files.length) h += `<p class="hint">${esc(t("drv.empty",{folder:FOLDER}))}</p>`;
  else h += `<div class="dr-list">${D.files.map(f=>{
      const cur = L && L.id===f.id, conf = D.confirmDel===f.id;
      return `<div class="dr-row${cur?" cur":""}"><div class="nm"><b title="${esc(stripExt(f.name))}">${esc(stripExt(f.name))}</b><small>${esc(t(cur?"drv.rowMetaCur":"drv.rowMeta",{date:fmtDate(f.modifiedTime)}))}</small></div>
        <button class="btn" data-d="open" data-id="${esc(f.id)}">${esc(t("drv.open"))}</button>
        <button class="btn danger" data-d="del" data-id="${esc(f.id)}">${esc(t(conf?"drv.confirm":"drv.del"))}</button></div>`;
    }).join("")}</div><p class="hint" style="margin-top:6px">${esc(t("drv.trashNote"))}</p>`;
  h += `</div><div class="dr-sec"><h3>${esc(t("drv.presets"))}</h3><p class="hint">${esc(t("drv.presetsHint"))}</p>
    <div class="btnrow"><button class="btn" data-d="psave">${esc(t("drv.psave"))}</button><button class="btn" data-d="pload">${esc(t("drv.pload"))}</button></div></div>`;
  if(D.busy) h += `<p class="hint" style="margin-top:10px">${esc(t(D.busy))}</p>`;
  return h;
}

/* ---------- sign-in ---------- */
function loadGIS(){
  if(window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
  if(D.gis) return D.gis;
  D.gis = new Promise((res,rej)=>{
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client"; s.async = true;
    s.onload = ()=>res(); s.onerror = ()=>{ D.gis = null; rej({code:"gis"}); };
    document.head.appendChild(s);
  });
  return D.gis;
}
function tokenClient(){
  if(!D.tc){
    D.tc = google.accounts.oauth2.initTokenClient({
      client_id: clientId(), scope: SCOPE,
      callback: r => { const p = D.pending; D.pending = null; if(p) p.ok(r); },
      error_callback: e => { const p = D.pending; D.pending = null; if(p) p.ko({code: e && e.type==="popup_closed" ? "closed" : "popup", message: e && e.message}); }
    });
  }
  return D.tc;
}
function requestToken(){
  return new Promise((ok,ko)=>{
    D.pending = {ok,ko};
    tokenClient().requestAccessToken({prompt: ls.get("was") ? "" : "consent"});
  }).then(r=>{
    if(r.error) throw {code:"denied", message:r.error_description||r.error};
    if(!google.accounts.oauth2.hasGrantedAllScopes(r, SCOPE)) throw {code:"scope"};
    D.tok = r.access_token; D.exp = Date.now() + ((+r.expires_in||3600) - 60)*1000;
    ls.set("was","1");
    return D.tok;
  });
}
const tokenOK = ()=> D.tok && Date.now() < D.exp;
async function login(){
  D.busy = "drv.busy.login"; setMsg("",""); render();
  try{
    await loadGIS();
    await requestToken();
    D.busy = "";
    setStatus(D.link ? "ok" : "off", D.link ? "drv.st.linked" : "");
    await afterLogin();
  }catch(e){ D.busy = ""; handleErr(e); }
  render();
}
async function afterLogin(){
  try{ const a = await api("about?fields=user(displayName,emailAddress)"); D.user = a.user; }catch(e){ if(e.code==="auth") throw e; }
  render();
  await refreshList();
  if(D.link && dirty()) scheduleAuto(500);
}
function logout(){
  try{ if(D.tok && window.google) google.accounts.oauth2.revoke(D.tok, ()=>{}); }catch(e){}
  D.tok = null; D.exp = 0; D.user = null; D.files = null; D.tc = null;
  ls.set("was", null);
  setStatus("off",""); setMsg("ok","drv.ok.logout"); render();
}

/* ---------- Drive API ---------- */
async function api(path, opt={}){
  if(!tokenOK()) throw {code:"auth"};
  const r = await fetch((opt.upload ? UPLOAD : API) + path, {
    method: opt.method || "GET", body: opt.body,
    headers: Object.assign({Authorization: "Bearer " + D.tok}, opt.headers || {})
  });
  if(r.status === 401){ D.tok = null; throw {code:"auth"}; }
  if(!r.ok){
    let m = ""; try{ m = (await r.json()).error.message; }catch(e){}
    throw {code: r.status===404 ? "notfound" : r.status===403 ? "forbidden" : "http", status:r.status, message:m};
  }
  if(opt.raw) return r.text();
  if(r.status === 204) return null;
  const txt = await r.text(); return txt ? JSON.parse(txt) : null;
}
function multipart(meta, content){
  const b = "stageplan" + Math.random().toString(36).slice(2);
  return {
    body: `--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${content}\r\n--${b}--`,
    headers: {"Content-Type": `multipart/related; boundary=${b}`}
  };
}
async function folder(){
  if(D.folderId){
    try{ const f = await api(`files/${encodeURIComponent(D.folderId)}?fields=id,trashed`); if(f && !f.trashed) return D.folderId; }
    catch(e){ if(e.code==="auth") throw e; }
  }
  const q = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${FOLDER}' and trashed=false`);
  const r = await api(`files?q=${q}&spaces=drive&fields=files(id)`);
  let id = r && r.files && r.files[0] && r.files[0].id;
  if(!id){
    const f = await api("files?fields=id", {method:"POST", body: JSON.stringify({name:FOLDER, mimeType:"application/vnd.google-apps.folder"}), headers:{"Content-Type":"application/json"}});
    id = f.id;
  }
  D.folderId = id; ls.set("folder", id);
  return id;
}
async function refreshList(){
  const fid = await folder();
  const q = encodeURIComponent(`'${fid}' in parents and trashed=false and mimeType='application/json'`);
  const r = await api(`files?q=${q}&orderBy=modifiedTime%20desc&pageSize=200&fields=files(id,name,modifiedTime,appProperties)`);
  /* "pianta" is the property key written by the first version of the app */
  const isPreset = f => f.appProperties && (f.appProperties.stageplan === "presets" || f.appProperties.pianta === "preset");
  D.files = (r.files || []).filter(f => !isPreset(f));
  render();
}
const projectBody = ()=> JSON.stringify(Object.assign(JSON.parse(snap()), {lib: libData()}));

async function saveProject(opts={}){
  const name = cleanName(opts.name || (D.link && D.link.name) || defaultName()) || defaultName();
  const body = projectBody(), s = snap();
  let f = null;
  if(D.link && !opts.asNew){
    let cur = null;
    try{ cur = await api(`files/${encodeURIComponent(D.link.id)}?fields=modifiedTime,trashed`); }
    catch(e){ if(e.code!=="notfound") throw e; }
    if(!cur || cur.trashed) setLink(null);
    else if(!opts.force && D.link.modified && cur.modifiedTime !== D.link.modified){ D.conflict = {remote: cur.modifiedTime}; throw {code:"conflict"}; }
    else {
      const mp = multipart({name: name + ".json"}, body);
      f = await api(`files/${encodeURIComponent(D.link.id)}?uploadType=multipart&fields=id,name,modifiedTime`, {method:"PATCH", upload:true, body:mp.body, headers:mp.headers});
    }
  }
  if(!f){
    const fid = await folder();
    const mp = multipart({name: name + ".json", parents:[fid], mimeType:"application/json", appProperties:{stageplan:"project"}}, body);
    f = await api("files?uploadType=multipart&fields=id,name,modifiedTime", {method:"POST", upload:true, body:mp.body, headers:mp.headers});
  }
  setLink({id:f.id, name:stripExt(f.name), modified:f.modifiedTime, at:Date.now()});
  D.lastSnap = s; D.conflict = null;
  setStatus("ok", "drv.st.saved", {time:fmtTime(Date.now())});
}
async function openProject(id){
  const meta = await api(`files/${encodeURIComponent(id)}?fields=id,name,modifiedTime`);
  const txt = await api(`files/${encodeURIComponent(id)}?alt=media`, {raw:true});
  let o; try{ o = JSON.parse(txt); }catch(e){ throw {code:"invalid"}; }
  if(!validProject(o)) throw {code:"invalid"};
  if(o.lib){ mergeLib(o.lib, false); saveLib(); }
  delete o.lib;
  D.opening = true;
  try{ restore(JSON.stringify(o)); ui.sel.clear(); commit(); fit(); }
  finally{ D.opening = false; }
  setLink({id:meta.id, name:stripExt(meta.name), modified:meta.modifiedTime, at:Date.now()});
  D.lastSnap = snap(); D.conflict = null;
  setStatus("ok", "drv.st.opened");
}
async function deleteFile(id){
  await api(`files/${encodeURIComponent(id)}`, {method:"PATCH", body: JSON.stringify({trashed:true}), headers:{"Content-Type":"application/json"}});
  if(D.link && D.link.id === id){ setLink(null); D.lastSnap = null; setStatus("off",""); }
}
async function presetFile(){
  const fid = await folder();
  const q = encodeURIComponent(`'${fid}' in parents and trashed=false and (appProperties has { key='stageplan' and value='presets' } or appProperties has { key='pianta' and value='preset' })`);
  const r = await api(`files?q=${q}&fields=files(id,modifiedTime)&orderBy=modifiedTime%20desc`);
  return r && r.files && r.files[0];
}
async function savePresets(){
  const ex = await presetFile(), body = JSON.stringify({v:2, lib: libData()});
  if(ex){
    const mp = multipart({}, body);
    await api(`files/${encodeURIComponent(ex.id)}?uploadType=multipart&fields=id`, {method:"PATCH", upload:true, body:mp.body, headers:mp.headers});
  } else {
    const mp = multipart({name:PRESET_FILE, parents:[await folder()], mimeType:"application/json", appProperties:{stageplan:"presets"}}, body);
    await api("files?uploadType=multipart&fields=id", {method:"POST", upload:true, body:mp.body, headers:mp.headers});
  }
}
async function loadPresets(){
  const ex = await presetFile();
  if(!ex) throw {code:"nopreset"};
  let o;
  try{ o = JSON.parse(await api(`files/${encodeURIComponent(ex.id)}?alt=media`, {raw:true})); }
  catch(e){ if(e.code) throw e; throw {code:"invalid"}; }
  if(!o || !o.lib) throw {code:"invalid"};
  mergeLib(o.lib, false); saveLib(); renderAll();
}

/* ---------- errors ---------- */
function handleErr(e){
  const c = e && e.code;
  const map = {auth:"drv.err.auth", conflict:"drv.err.conflict", closed:"drv.err.closed", popup:"drv.err.popup", gis:"drv.err.gis", denied:"drv.err.denied", scope:"drv.err.scope", invalid:"drv.err.invalid", nopreset:"drv.err.nopreset", notfound:"drv.err.notfound", forbidden:"drv.err.forbidden"};
  const key = map[c] || "drv.err.generic";
  const kind = ["auth","conflict","closed","nopreset"].includes(c) ? "warn" : "err";
  setMsg(kind, key, {detail:detail(e)});
  if(c==="auth"){ D.tok = null; setStatus("warn","drv.st.expired"); }
  else if(c==="conflict") setStatus("warn","drv.st.conflict");
  else if(c==="scope") D.tok = null;
  else if(c==="forbidden" || !map[c]) setStatus("err","drv.st.error");
  render();
}
async function run(busyKey, fn, okKey){
  if(D.busy) return;
  D.busy = busyKey; setMsg("",""); render();
  try{
    if(!tokenOK()) throw {code:"auth"};
    await fn();
    D.busy = ""; if(okKey){ setMsg("ok", okKey); toast(t(okKey)); }
  }catch(e){ D.busy = ""; handleErr(e); }
  render();
}

/* ---------- automatic saving ---------- */
function scheduleAuto(ms){
  if(!D.link || !D.auto || D.opening || D.conflict) return;
  clearTimeout(D.timer);
  D.timer = setTimeout(autoSave, ms==null ? 2500 : ms);
}
async function autoSave(){
  if(!D.link || !D.auto || D.conflict || !dirty()) return;
  if(!tokenOK()){ setStatus("warn","drv.st.unsaved"); return; }
  if(D.busy){ scheduleAuto(1500); return; }
  setStatus("saving","drv.st.saving");
  try{ await saveProject({}); }
  catch(e){
    if(e.code==="conflict"){ handleErr(e); toast(t("drv.toast.conflict")); }
    else if(e.code==="auth"){ D.tok=null; setStatus("warn","drv.st.expired"); }
    else setStatus("err","drv.st.error");
  }
  render();
}
const baseCommit = window.commit;
window.commit = function(){
  /* a new plan was started instead of resuming the last one: forget the old file so it is never overwritten */
  if(D.idleLink){ D.idleLink = null; setLink(null); }
  const r = baseCommit.apply(this, arguments); scheduleAuto(); return r;
};

/* ---------- events ---------- */
function open(){
  modal.classList.add("on"); setMsg("",""); D.confirmDel = null;
  render();
  if(clientId()) loadGIS().catch(()=>{});
  if(tokenOK()){ if(!D.user) afterLogin().catch(handleErr); else refreshList().catch(handleErr); }
  else if(clientId() && ls.get("was") && window.google && google.accounts) login();
}
function close(){ modal.classList.remove("on"); }
btn.addEventListener("click", open);
modal.addEventListener("click", e=>{ if(e.target===modal) close(); });
modal.addEventListener("keydown", e=>{ if(e.key==="Escape") close(); e.stopPropagation(); });
box.addEventListener("change", e=>{
  const tg = e.target;
  if(tg.dataset.d==="auto"){ D.auto = tg.checked; ls.set("auto", tg.checked ? "1" : "0"); if(D.auto) scheduleAuto(300); }
});
box.addEventListener("click", e=>{
  const b = e.target.closest("[data-d]"); if(!b || b.tagName==="INPUT") return;
  const act = b.dataset.d, id = b.dataset.id;
  if(act!=="del") D.confirmDel = null;
  const nameInput = ()=> cleanName((document.getElementById("drName")||{}).value || "");
  switch(act){
    case "close": close(); break;
    case "login": login(); break;
    case "logout": logout(); break;
    case "copyorigin":
      try{ navigator.clipboard.writeText(location.origin).then(()=>toast(t("drv.toast.copied")), ()=>toast(t("drv.toast.noCopy"))); }catch(err){ toast(t("drv.toast.noCopy")); }
      break;
    case "savecid": {
      const v = String((document.getElementById("drCid")||{}).value||"").trim();
      if(!/\.apps\.googleusercontent\.com$/.test(v)){ setMsg("err","drv.err.cid"); render(); break; }
      ls.set("cid", v); D.tc = null; setMsg("ok","drv.ok.cid"); render(); loadGIS().catch(()=>{});
      break; }
    case "resetcid": ls.set("cid", null); D.tc = null; D.tok = null; render(); break;
    case "save": run("drv.busy.save", ()=>saveProject({name:nameInput()}).then(refreshList), "drv.ok.saved"); break;
    case "saveas": {
      const nm = nameInput(), name = D.link && nm===D.link.name ? nm + t("drv.copySuffix") : nm;
      run("drv.busy.save", ()=>saveProject({name, asNew:true}).then(refreshList), "drv.ok.savedNew"); break; }
    case "force": run("drv.busy.save", ()=>saveProject({name:nameInput(), force:true}).then(refreshList), "drv.ok.forced"); break;
    case "openlinked": if(D.link) run("drv.busy.open", ()=>openProject(D.link.id).then(refreshList), "drv.ok.openedRemote"); break;
    case "unlink": setLink(null); D.lastSnap = null; D.conflict = null; setStatus("off",""); setMsg("ok","drv.ok.unlinked"); render(); break;
    case "refresh": run("drv.busy.refresh", refreshList); break;
    case "open":
      if(D.link && dirty() && D.link.id!==id && !b.dataset.sure){
        setMsg("warn","drv.unsavedOpen"); render();
        const nb = box.querySelector(`[data-d="open"][data-id="${CSS.escape(id)}"]`); if(nb) nb.dataset.sure = "1";
        break;
      }
      run("drv.busy.open", ()=>openProject(id).then(refreshList), "drv.ok.opened"); break;
    case "del":
      if(D.confirmDel!==id){ D.confirmDel = id; render(); break; }
      D.confirmDel = null; run("drv.busy.delete", ()=>deleteFile(id).then(refreshList), "drv.ok.deleted"); break;
    case "psave": run("drv.busy.psave", savePresets, "drv.ok.psaved"); break;
    case "pload": run("drv.busy.pload", loadPresets, "drv.ok.ploaded"); break;
  }
});
if(typeof langHooks !== "undefined") langHooks.push(render);

/* ---------- initial state ---------- */
/* The app opens on an empty stage: the link to the last plan's file waits until that plan is resumed. */
if(D.link && !state.musicians.length){ D.idleLink = D.link; D.link = null; }
if(typeof resumeHooks !== "undefined") resumeHooks.push(()=>{
  if(!D.idleLink) return;
  D.link = D.idleLink; D.idleLink = null; D.lastSnap = snap();
  if(D.tok) setStatus("ok","drv.st.linked"); else if(D.status==="idle") setStatus("idle","drv.st.resumeLinked",{name:D.link.name});
  render();
});
if(clientId() && ls.get("was")){
  if(D.link) setStatus("idle","drv.st.resumeLinked",{name:D.link.name}); else setStatus("idle","drv.st.resume");
  loadGIS().catch(()=>{});
}
if(D.link) D.lastSnap = snap();
render();
})();
