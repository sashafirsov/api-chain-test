// this file is needed for running html file tests under @web/dev-server

const sessionId =  new URL(window.location.href).searchParams.get("wtr-session-id");
if( !sessionId )
    window.location.href += "?&wtr-session-id=simulate-test-runner"

window.__WTR_CONFIG__ = {"testFile":window.location.pathname+"?wtr-session-id="+sessionId, "watch":false, "debug":true };

export function sendMessage(){}
