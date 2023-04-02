    const club = data.club_id;
    const groupName = groupClubs[club];
    let result = [];
    if (groupName) result = golfClubGroups[groupName];
    objResp = {
      resultCode: 1,
      message: "OK",
      data: result,
    };