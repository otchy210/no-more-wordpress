/*
 * Copyright (c) 2010 Otchy
 * This source file is subject to the MIT license.
 * https://www.otchy.net
 */
var TwitterAPI = {
version:'2.0.0',
a: null,
api: function() {
	if (!TwitterAPI.a) {TwitterAPI.a = new TwitAPI(TwitterAPI.SERVER, TwitterAPI.PATH);}
	return TwitterAPI.a;
},
call: function(method, path, func, param) {
	TwitterAPI.api().call(method, path, func, param);
},
relogin:function(f) {
	TwitterAPI.api().login();
},
search:function(f,i,p){TwitterAPI.call('get','search',f,p);},
statuses:{
	public_timeline:function(f,i,p){TwitterAPI.call('get','statuses/public_timeline',f,p);},
	friends_timeline:function(f,i,p){TwitterAPI.call('get','statuses/friends_timeline/'+i,f,p);},
	user_timeline:function(f,i,p){TwitterAPI.call('get','statuses/user_timeline/'+i,f,p);},
	show:function(f,i,p){TwitterAPI.call('get','statuses/show/'+i,f,p);},
	update:function(s,f) {TwitterAPI.call('post','statuses/update',f,{'status':s});},
	mentions:function(f,i,p){TwitterAPI.call('get','statuses/mentions',f,p);},
	destroy:function(f,i,p){TwitterAPI.call('get','statuses/destroy/'+i,f);},
	friends:function(f,i,p){TwitterAPI.call('get','statuses/friends/'+i,f,p);},
	followers:function(f,i,p){TwitterAPI.call('get','statuses/followers/'+i,f,p);},
	featured:function(f,i,p){TwitterAPI.call('get','statuses/featured',f);}
},
users:{
	show:function(f,i,p){TwitterAPI.call('get','users/show/'+i,f,p);},
	own:function(f) {
		TwitterAPI.statuses.user_timeline(function(r) {
			if (r&&r.length&&r.length>0) {f(r[0].user);}
		},null,'count=1');
	}
},
direct_messages:{
	show:function(f,i,p){TwitterAPI.call('get','direct_messages',f,p);},
	sent:function(f,i,p){TwitterAPI.call('get','direct_messages/sent',f,p);},
	create:function(u,x,f) {TwitterAPI.call('post', 'direct_messages/new',f,{'user':u,'text':x});},
	destroy:function(f,i,p){TwitterAPI.call('get','direct_messages/destroy/'+i,f,p);}
},
friendships:{
	create:function(f,i,p){TwitterAPI.call('post','friendships/create/'+i,f,p);},
	destroy:function(f,i,p){TwitterAPI.call('post','friendships/destroy/'+i,f,p);},
	exists:function(f,i,p){TwitterAPI.call('get','friendships/exists',f,p);},
	show:function(f,i,p){TwitterAPI.call('get','friendships/show',f,p);}
},
friends:{
	ids:function(f,i,p){TwitterAPI.call('get','friends/ids',f,p);}
},
followers:{
	ids:function(f,i,p){TwitterAPI.call('get','followers/ids',f,p);}
},
account:{
	verify_credentials:function(f,i,p){TwitterAPI.call('get','account/verify_credentials',f);},
	rate_limit_status:function(f,i,p){TwitterAPI.call('get','account/rate_limit_status',f);},
	end_session:function(f,i,p){TwitterAPI.call('get','account/end_session',f);},
	update_delivery_device:function(f,i,p){TwitterAPI.call('get','account/update_delivery_device',f,p);},
	update_profile_colors:function(f,i,p){TwitterAPI.call('post','account/update_profile_colors/'+i,f,p);},
	update_profile_image:function(f,i,p){TwitterAPI.call('post','account/update_profile_image/'+i,f,p);},
	update_profile_background_image:function(f,i,p){TwitterAPI.call('post','account/update_profile_background_image/'+i,f,p);},
	update_profile:function(f,i,p){TwitterAPI.call('post','account/update_profile/'+i,f,p);}
},
favorites:{
	show:function(f,i,p){TwitterAPI.call('get','favorites/'+i,f,p);},
	create:function(f,i,p){TwitterAPI.call('post','favorites/create/'+i,f,p);},
	destroy:function(f,i,p){TwitterAPI.call('post','favorites/destroy/'+i,f,p);}
},
notifications:{
	follow:function(f,i,p){TwitterAPI.call('get','notifications/follow/'+i);},
	leave:function(f,i,p){TwitterAPI.call('get','notifications/leave/'+i);}
},
blocks:{
	create:function(f,i,p){TwitterAPI.call('post','blocks/create/'+i,f,p);},
	destroy:function(f,i,p){TwitterAPI.call('post','blocks/destroy/'+i,f,p);},
	exists:function(f,i,p){TwitterAPI.call('get','blocks/exists/'+i,f,p);},
	blocking:{
		show:function(f,i,p){TwitterAPI.call('get','blocks/blocking/'+i,f,p);},
		ids:function(f,i,p){TwitterAPI.call('get','blocks/blocking/ids',f,p);}
	}
},
help:{
	test:function(f,i,p){TwitterAPI.call('get','help/test');},
	downtime_schedule:function(f,i,p){TwitterAPI.call('get','help/downtime_schedule');}
}
}
