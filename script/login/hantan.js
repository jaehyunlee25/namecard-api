    memberID.value = '${login_id}';
    memberPassword.value = '${login_password}';
    doc.gcn("btn")[0].children[0].click();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("toparea")[0].gtn("a")[0].str();
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */