    delDeviceTime(data, (res2) => {
      objResp = {
        resultCode: 200,
        message: "디바이스 타임 자료를 모두 삭제했습니다.",
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });