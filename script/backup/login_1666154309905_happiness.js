    user_id.value = '${login_id}';
    user_pw.value = '${login_password}';
    Login_Check();

    /* begin: precheck content */
    function precheck() {
      const strLogout = "로그아웃";
      const str = doc.gcn("btn_login")[0].gtn("img")[0].attr("alt");
      if (str == strLogout) {
        if (ac) ac.message("ALREADY_LOGIN");
        return true;
      }
      return false;
    }
    /* end: precheck content */