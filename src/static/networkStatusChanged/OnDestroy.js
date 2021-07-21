document.removeEventListener('offline', $parameters.offlineHandlerObj);
document.removeEventListener('online', $parameters.onlineHandlerObj);
document.removeEventListener('deviceready', $parameters.deviceReadyActionReference);
window.removeEventListener('offline', $parameters.OfflineActionReference);
window.removeEventListener('online', $parameters.OnlineActionReference);
