function post(f) {
    var status = f.status.value;
    TwitterAPI.statuses.update(status, function() {
    	alert('DONE!');
    	f.status.value = '';
    });
  }
  function callback(arr) {
    var str = '';
    for (var i=0; i<arr.length; i++) {
      var obj = arr[i];
      str += obj.user.screen_name + ':' + obj.text + '<br />';
    }
    document.getElementById('result').innerHTML = str;
  }
  function getTl() {
    var id = document.getElementById('id').value;
    var param = 'count=10';
    TwitterAPI.statuses.user_timeline(callback, id, param);
  }