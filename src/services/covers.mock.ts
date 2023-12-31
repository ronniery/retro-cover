type MockGameCover = {
  marioGolf: {
    cover1: {
      extras: string;
      coverId: number;
      html: string;
    };
    cover2: {
      extras: string;
      coverId: number;
      html: string;
    };
  };
};

export const mockGameCovers = (): MockGameCover => ({
  marioGolf: {
    cover1: {
      extras: 'Created by: wshbrngr',
      coverId: 8285,
      html: `<table border=0 cellpadding=2 cellspacing=0 width=650 class=newsTable style=background-color:#f4f7f9><tr><td class=newsHeader><a href="/view.php?cat_id=2">GameCube</a> Game Covers > <a href="/view.php?cat_id=2&view=M">M</a><tr><td class=pageBody><table border=0 cellpadding=2 cellspacing=0 width=650><tr><td class=pageBody valign=top><h2>Mario Golf: Toadstool Tour</h2><br><div id=covers><ul><li class=tabHeader>Available Covers<li class=tabSelected><a href="view.php?cover_id=8285">Retail Cover<br><span style=font-size:10px;padding-left:2px>Format: NTSC<br>Country: <img src=/images/flags/us.png border=0></span></a><li><a href="view.php?cover_id=9745"class=thumbnail onmouseout='hideThumb("9745")'onmouseover='showThumb("9745","https://coverproject.sfo2.cdn.digitaloceanspaces.com/gamecube/gc_mariogolftoadstooltour_gb_thumb.jpg")'>Retail Cover<br><span style=font-size:10px>Format: PAL<br>Country: <img src=/images/flags/gb.png border=0></span><span class=thumb><img src=/images/indicators/indicator_snake_large.gif id=9745 name=9745></span></a></ul></div><td class=pageBody valign=top><img src=https://coverproject.sfo2.cdn.digitaloceanspaces.com/gamecube/gc_mariogolf_thumb.jpg style="border:1px #b0bdc6 solid"><h3>Cover Details:</h3>Description: Retail Cover<br>Format: NTSC<br>Created by: <a href="http://www.thecoverproject.net/forums/index.php?action=profile;u=3">wshbrngr</a><br>Region: United States <img src=/images/flags/us.png border=0><br>Case Type: Gamecube Case<br><br>This cover has been downloaded 40808 times<h2><a href="/download_cover.php?src=cdn&cover_id=8285">Download</a></h2></table></table>`,
    },
    cover2: {
      extras: 'Created by: Grumbleduke',
      coverId: 9745,
      html: `<table border=0 cellpadding=2 cellspacing=0 width=650 class=newsTable style=background-color:#f4f7f9><tr><td class=newsHeader><a href="/view.php?cat_id=2">GameCube</a> Game Covers > <a href="/view.php?cat_id=2&view=M">M</a><tr><td class=pageBody><table border=0 cellpadding=2 cellspacing=0 width=650><tr><td class=pageBody valign=top><h2>Mario Golf: Toadstool Tour</h2><br><div id=covers><ul><li class=tabHeader>Available Covers<li><a href="view.php?cover_id=8285"class=thumbnail onmouseout='hideThumb("8285")'onmouseover='showThumb("8285","https://coverproject.sfo2.cdn.digitaloceanspaces.com/gamecube/gc_mariogolf_thumb.jpg")'>Retail Cover<br><span style=font-size:10px>Format: NTSC<br>Country: <img src=/images/flags/us.png border=0></span><span class=thumb><img src=/images/indicators/indicator_snake_large.gif id=8285 name=8285></span></a><li class=tabSelected><a href="view.php?cover_id=9745">Retail Cover<br><span style=font-size:10px;padding-left:2px>Format: PAL<br>Country: <img src=/images/flags/gb.png border=0></span></a></ul></div><td class=pageBody valign=top><img src=https://coverproject.sfo2.cdn.digitaloceanspaces.com/gamecube/gc_mariogolftoadstooltour_gb_thumb.jpg style="border:1px #b0bdc6 solid"><h3>Cover Details:</h3>Description: Retail Cover<br>Format: PAL<br>Created by: Grumbleduke<br>Region: Great Britain <img src=/images/flags/gb.png border=0><br>Case Type: DVD Case - Standard<br><br>This cover has been downloaded 1525 times<h2><a href="/download_cover.php?src=cdn&cover_id=9745">Download</a></h2></table></table>`,
    },
  },
});
