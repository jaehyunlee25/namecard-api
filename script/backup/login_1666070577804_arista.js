    userId1.value = "newrison";
    userPw1.value = "ya2ssarama!";
    Login_Check();

    /* begin: precheck content */
    function precheck() {
      if (doc.gcn("loginBtn").length > 0) return false;
      const strLogout = "로그아웃";
      const str = doc.gcn("btn loginBtn btn-xs")[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */