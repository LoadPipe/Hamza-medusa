select * from product where id='prod_01J7WWNVCB2XX2PB372QNNDXEF'

update product set 
title='Micro SD Card for Mobile Phones - Fast Transfer Speeds - Wide Compatibility',
subtitle='32GB microSD card offers fast transfer speeds, 4K UHD video support, and ample storage for photos, videos, and apps. Built to last, it’s waterproof, shock-proof, temperature-proof, and X-ray-proof. Compatible with a wide range of devices like smartphones, cameras, and tablets, it''s a reliable storage solution',
handle='micro-sd-card',
description='<p>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/4XqJ8hrs-tM?si=ZMSmRLeV___Z7Rs7?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <img src="https://static.snapchum.com/SC001/info1.png">
    <img src="https://static.snapchum.com/SC001/info2.png">
    <img src="https://static.snapchum.com/SC001/info3.png">
    <img src="https://static.snapchum.com/SC001/info4.png">
</p>'
where id='prod_01J7WWNVCB2XX2PB372QNNDXEF'

delete from product_images where product_id='prod_01J7WWNVCB2XX2PB372QNNDXEF';

insert into image (id, url) values ('img_01J7WWNVCB2XX2PB372QNNDXEF_main', 'https://static.snapchum.com/SC001/main-branded.png');
insert into image (id, url) values ('img_01J7WWNVCB2XX2PB372QNNDXEF_t1', 'https://static.snapchum.com/SC001/thumbnail1.png');
insert into image (id, url) values ('img_01J7WWNVCB2XX2PB372QNNDXEF_t2', 'https://static.snapchum.com/SC001/thumbnail2.png');
insert into image (id, url) values ('img_01J7WWNVCB2XX2PB372QNNDXEF_t3', 'https://static.snapchum.com/SC001/thumbnail3.png');
insert into image (id, url) values ('img_01J7WWNVCB2XX2PB372QNNDXEF_t4', 'https://static.snapchum.com/SC001/thumbnail4.png');


insert into product_images(product_id, image_id) values ('prod_01J7WWNVCB2XX2PB372QNNDXEF', 'img_01J7WWNVCB2XX2PB372QNNDXEF_main');
insert into product_images(product_id, image_id) values ('prod_01J7WWNVCB2XX2PB372QNNDXEF', 'img_01J7WWNVCB2XX2PB372QNNDXEF_t1');
insert into product_images(product_id, image_id) values ('prod_01J7WWNVCB2XX2PB372QNNDXEF', 'img_01J7WWNVCB2XX2PB372QNNDXEF_t2');
insert into product_images(product_id, image_id) values ('prod_01J7WWNVCB2XX2PB372QNNDXEF', 'img_01J7WWNVCB2XX2PB372QNNDXEF_t3');
insert into product_images(product_id, image_id) values ('prod_01J7WWNVCB2XX2PB372QNNDXEF', 'img_01J7WWNVCB2XX2PB372QNNDXEF_t4');

update product set thumbnail='https://static.snapchum.com/SC001/main-plain.png' where id='prod_01J7WWNVCB2XX2PB372QNNDXEF';

update product_variant set metadata = '{"imgUrl":"https://static.snapchum.com/SC001/main-branded.png"}'::jsonb where product_id = 'prod_01J7WWNVCB2XX2PB372QNNDXEF'

select * from product_variant where product_id='prod_01J7WWNVCB2XX2PB372QNNDXEF' and title like '8GB%' or title like '32GB%';
update product_variant set deleted_at=now()::date where product_id='prod_01J7WWNVCB2XX2PB372QNNDXEF' and title not like '8GB%' and title not like '32GB%';
update product_variant set inventory_quantity=0 where product_id='prod_01J7WWNVCB2XX2PB372QNNDXEF' and deleted_at is not null;

select * from product_variant where deleted_at is not null; 
select * from product_option where product_variant_id = 'variant_01J7ZZJSJS2A4AVDWCB6C4ZSJN' 
select * from product_option where product_id='prod_01J7WWNVCB2XX2PB372QNNDXEF'
select * from product_variant
select * from product_option_value where option_id = 'opt_01J7WWNVD2DKE49F0QWCQ7CNTM'
update product_option_value set deleted_at=now()::date where value not like '8%' and value not like '32%' 
and option_id = 'opt_01J7WWNVD2DKE49F0QWCQ7CNTM'

update money_amount set amount = 899 where id in(
    'ma_01J7WWNVJSJC2HRZTB1BA4NXHQ',
	'ma_01J7WWNVJS4XGVNFWCCD5VQRMD',
	'ma_01J7WWNVJSKZ0P2N3B4NJR3WF6',
	'ma_01J7WWNVJSJ43A44PMB7DE0Y0K',
	'ma_01J7WWNVJT56PVXXFBRPDY6D1X',
	'ma_01J7WWNVJTXCRV5VTTCHH46YFE',
	'ma_01J7WWNVJTTTZT692VQ3EB9SM7',
'ma_01J7WWNVJTTEGR3SNRB8TE0V2D',
'ma_01J7WWNVJVNYPMW7TEG3FFYAZG',
'ma_01J7WWNVJVNGC4DWM46YSQJSHX',
'ma_01J7WWNVJVJ84JWDKDTDWKKS2Q',
'ma_01J7WWNVJV7DTC627E67Y206WZ',
'ma_01J7WWNVJVYSXNWQ4325CW00Y0',
'ma_01J7WWNVJW4HR68VRHJ301YM48',
'ma_01J7WWNVJWA6BTTH6K43YB0Q77',
'ma_01J7WWNVJWMFMQ7PXHX4DVPCVZ',
'ma_01J7WWNVJWPWG0PDR6ZABMMYTV',
'ma_01J7WWNVJX1663GE6E4E2TDH2P',
	'ma_01J7WWNVJXDWBV0EAQ0W9B30PK',
	'ma_01J7WWNVJXJMK5VTE45D8S1V53',
	'ma_01J7WWNVJX48N276VPR5M94P8B',
	'ma_01J7WWNVJXZRAMZ0ZBJ7PMV1E6');
----------------------------------------------------------------------------------------------------------------------

update product set 
title='Micro SD card for Cameras - Durability: Waterproof, temperature-proof - Full HD Video Support',
subtitle='The SanDisk Ultra 16GB SD Card delivers up to 100MB/s speeds for Full HD video and photo capture. It''s durable and works with cameras, smartphones, and tablets.',
handle='sd-card-camera',
description='<p>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/OrmZkwoHsbQ?si=AQkSc6Gbq4S3a-6t?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <img src="https://static.snapchum.com/SC002/info1.png">
    <img src="https://static.snapchum.com/SC002/info2.png">
    <img src="https://static.snapchum.com/SC002/info3.png">
    <img src="https://static.snapchum.com/SC002/info4.png">
</p>'
where id='prod_01J8326VDM2A8S8R8HGT7F1TCW'

delete from product_images where product_id='prod_01J8326VDM2A8S8R8HGT7F1TCW';

insert into image (id, url) values ('img_01J8326VDM2A8S8R8HGT7F1TCW_main', 'https://static.snapchum.com/SC002/main-plain.png');
insert into image (id, url) values ('img_01J8326VDM2A8S8R8HGT7F1TCW_t1', 'https://static.snapchum.com/SC002/thumbnail1.png');
insert into image (id, url) values ('img_01J8326VDM2A8S8R8HGT7F1TCW_t2', 'https://static.snapchum.com/SC002/thumbnail2.png');
insert into image (id, url) values ('img_01J8326VDM2A8S8R8HGT7F1TCW_t3', 'https://static.snapchum.com/SC002/thumbnail3.png');
insert into image (id, url) values ('img_01J8326VDM2A8S8R8HGT7F1TCW_t4', 'https://static.snapchum.com/SC002/thumbnail4.png');

insert into product_images(product_id, image_id) values ('prod_01J8326VDM2A8S8R8HGT7F1TCW', 'img_01J8326VDM2A8S8R8HGT7F1TCW_main');
insert into product_images(product_id, image_id) values ('prod_01J8326VDM2A8S8R8HGT7F1TCW', 'img_01J8326VDM2A8S8R8HGT7F1TCW_t1');
insert into product_images(product_id, image_id) values ('prod_01J8326VDM2A8S8R8HGT7F1TCW', 'img_01J8326VDM2A8S8R8HGT7F1TCW_t2');
insert into product_images(product_id, image_id) values ('prod_01J8326VDM2A8S8R8HGT7F1TCW', 'img_01J8326VDM2A8S8R8HGT7F1TCW_t3');
insert into product_images(product_id, image_id) values ('prod_01J8326VDM2A8S8R8HGT7F1TCW', 'img_01J8326VDM2A8S8R8HGT7F1TCW_t4');


update product set thumbnail='https://static.snapchum.com/SC002/main-plain.png' where id='prod_01J8326VDM2A8S8R8HGT7F1TCW';


update money_amount set amount = 749 where id in (
'ma_01J8326VH16G4JJ1CZ7H2PH694', 
'ma_01J8326VH1K1MD69TMX6BBMAF9', 
'ma_01J8326VH1F34YM12Z2WNVX7SZ', 
'ma_01J8326VH1TB10KKZSB2VF39ZY', 
'ma_01J8326VH2T7J06M183XZYXK6N', 
'ma_01J8326VH2G8ETCHH9880J5R0B', 
'ma_01J8326VH2B0ZHQD7T5AGYHEKN', 
'ma_01J8326VH2CZA2YNGYERVNP75F', 
'ma_01J8326VH34PT07CFKJPYNEFVF', 
'ma_01J8326VH3FEY9GB0E4X758R00', 
'ma_01J8326VH3B0C570GN1E6H58ZN', 
'ma_01J8326VH3H2A04WNR2S8R4MP5');


select * from product_variant where product_id='prod_01J8326VDM2A8S8R8HGT7F1TCW' and title like '32%' or title like '64%';

select * from product_option where product_id='prod_01J8326VDM2A8S8R8HGT7F1TCW'
update product_option set deleted_at=now()::date where id ='opt_01J8326VE2Q3FFFG7G2209CSWQ'
select * from product_variant
select * from product_option_value where option_id = 'opt_01J8326VE2THS0GYVZPNAZKVQK'
update product_option_value set deleted_at=now()::date where value not like '32%' and value not like '64%' 
and option_id = 'opt_01J8326VE2THS0GYVZPNAZKVQK'
update product_option_value set deleted_at=now()::date where 
 option_id = 'opt_01J8326VE2Q3FFFG7G2209CSWQ'

 select * from product_variant where product_id='prod_01J8326VDM2A8S8R8HGT7F1TCW'

 update product_variant set metadata = '{"imgUrl":"https://static.snapchum.com/SC002/main-branded.png"}'::jsonb
 where product_id='prod_01J8326VDM2A8S8R8HGT7F1TCW'

----------------------------------------------------------------------------------------------------------------------------------

update product set 
title='Rapoo M10 Wireless Mouse - High Precision, Ergonomic Design, Long Battery Life',
subtitle='Experience smooth navigation with Rapoo M10 Wireless Mouse. Ergonomically designed for comfort, it offers precision control for all computing tasks.',
handle='mouse-rapoo-m10',
description='<p>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/RutQx7icIME?si=Lq9ERrqSgpnPDpBN?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <br/><img src="https://static.snapchum.com/SC003/info1.png">
    <br/><img src="https://static.snapchum.com/SC003/info2.png">
    <br/><img src="https://static.snapchum.com/SC003/info3.png">
    <br/><img src="https://static.snapchum.com/SC003/info4.png">
    <br/><img src="https://static.snapchum.com/SC003/info5.png">
</p>'
where id='prod_01J8319HHATQ2CWH70VQR2VG9T';

delete from product_images where product_id='prod_01J8319HHATQ2CWH70VQR2VG9T';

insert into image (id, url) values ('img_01J8319HHATQ2CWH70VQR2VG9T_main', 'https://static.snapchum.com/SC003/main-plain-white.png');
insert into image (id, url) values ('img_01J8319HHATQ2CWH70VQR2VG9T_t1', 'https://static.snapchum.com/SC003/thumbnail1.png');
insert into image (id, url) values ('img_01J8319HHATQ2CWH70VQR2VG9T_t2', 'https://static.snapchum.com/SC003/thumbnail2.png');
insert into image (id, url) values ('img_01J8319HHATQ2CWH70VQR2VG9T_t3', 'https://static.snapchum.com/SC003/thumbnail3.png');
insert into image (id, url) values ('img_01J8319HHATQ2CWH70VQR2VG9T_t4', 'https://static.snapchum.com/SC003/thumbnail4.png');

insert into product_images(product_id, image_id) values ('prod_01J8319HHATQ2CWH70VQR2VG9T', 'img_01J8319HHATQ2CWH70VQR2VG9T_main');
insert into product_images(product_id, image_id) values ('prod_01J8319HHATQ2CWH70VQR2VG9T', 'img_01J8319HHATQ2CWH70VQR2VG9T_t1');
insert into product_images(product_id, image_id) values ('prod_01J8319HHATQ2CWH70VQR2VG9T', 'img_01J8319HHATQ2CWH70VQR2VG9T_t2');
insert into product_images(product_id, image_id) values ('prod_01J8319HHATQ2CWH70VQR2VG9T', 'img_01J8319HHATQ2CWH70VQR2VG9T_t3');
insert into product_images(product_id, image_id) values ('prod_01J8319HHATQ2CWH70VQR2VG9T', 'img_01J8319HHATQ2CWH70VQR2VG9T_t4');


update product set thumbnail='https://static.snapchum.com/SC003/main-plain-black.png' where id='prod_01J8319HHATQ2CWH70VQR2VG9T';


update money_amount set amount = 1299 where id = 'ma_01J8319HK0F2HTE2YXR3JS7283';
update money_amount set amount = 1299 where id = 'ma_01J8319HK051FSCXG5QETAF1VE';
update money_amount set amount = 1299 where id = 'ma_01J8319HK1NWNK1CZKBDNK5WM2';
update money_amount set amount = 1299 where id = 'ma_01J8319HK1HA3EEGZS9A22QXPY';

update product set status='published' where id='prod_01J8319HHATQ2CWH70VQR2VG9T';

----------------------------------------------------------------------------------------------------------------------------------

update product set 
title='Rapoo V700 Mechanical Keyboard for Gaming - Responsive, Durable, and Customizable',
subtitle='Elevate your gaming with the Rapoo V700 Gaming Mechanical Keyboard, providing superior tactile feedback and customizable keys for optimal performance.',
handle='mechanical-keyboard-rapoo-v700',
description='<p>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/oLvtjZpCtqM?si=_7ieTuUu-V4SyPbu" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <img src="https://static.snapchum.com/SC004/main-branded.png"><br/>
    <img src="https://static.snapchum.com/SC004/lifestyle1.png"><br/>
    <img src="https://static.snapchum.com/SC004/lifestyle2.png"><br/>
    <img src="https://static.snapchum.com/SC004/lifestyle3.png"><br/>
    <img src="https://static.snapchum.com/SC004/lifestyle4.png"><br/>
    <img src="https://static.snapchum.com/SC004/info1.png"><br/>
    <img src="https://static.snapchum.com/SC004/info2.png"><br/>
    <img src="https://static.snapchum.com/SC004/info3.png"><br/>
    <img src="https://static.snapchum.com/SC004/info4.png">
</p>'
where id='prod_01J831AS9B4R9PPSGV1NSZ4T1K';

delete from product_images where product_id='prod_01J831AS9B4R9PPSGV1NSZ4T1K';
insert into image (id, url) values ('img_01J831AS9B4R9PPSGV1NSZ4T1K_main', 'https://static.snapchum.com/SC004/main-plain.png');
insert into image (id, url) values ('img_01J831AS9B4R9PPSGV1NSZ4T1K_t1', 'https://static.snapchum.com/SC004/thumbnail1.png');
insert into image (id, url) values ('img_01J831AS9B4R9PPSGV1NSZ4T1K_t2', 'https://static.snapchum.com/SC004/thumbnail2.png');
insert into image (id, url) values ('img_01J831AS9B4R9PPSGV1NSZ4T1K_t3', 'https://static.snapchum.com/SC004/thumbnail3.png');
insert into image (id, url) values ('img_01J831AS9B4R9PPSGV1NSZ4T1K_t4', 'https://static.snapchum.com/SC004/thumbnail4.png');

update product set thumbnail='https://static.snapchum.com/SC004/main-plain.png' where id='prod_01J831AS9B4R9PPSGV1NSZ4T1K';

insert into product_images(product_id, image_id) values ('prod_01J831AS9B4R9PPSGV1NSZ4T1K', 'img_01J831AS9B4R9PPSGV1NSZ4T1K_main');
insert into product_images(product_id, image_id) values ('prod_01J831AS9B4R9PPSGV1NSZ4T1K', 'img_01J831AS9B4R9PPSGV1NSZ4T1K_t1');
insert into product_images(product_id, image_id) values ('prod_01J831AS9B4R9PPSGV1NSZ4T1K', 'img_01J831AS9B4R9PPSGV1NSZ4T1K_t2');
insert into product_images(product_id, image_id) values ('prod_01J831AS9B4R9PPSGV1NSZ4T1K', 'img_01J831AS9B4R9PPSGV1NSZ4T1K_t3');
insert into product_images(product_id, image_id) values ('prod_01J831AS9B4R9PPSGV1NSZ4T1K', 'img_01J831AS9B4R9PPSGV1NSZ4T1K_t4');

update product set status='published' where id='prod_01J831AS9B4R9PPSGV1NSZ4T1K';

update product_option_value set deleted_at=now()::date where value like 'Philips%'

----------------------------------------------------------------------------------------------------------------------------------

update product set 
title='Wireless Mini Bluetooth Speakers - Portable, Waterproof, Powerful Bass',
subtitle='Discover unbeatable sound quality with our Portable Wireless Mini Bluetooth Outdoor Speaker, featuring waterproof construction and a super heavy subwoofer for immersive bass.',
handle='wireless-bluetooth-speakers',
description='<p>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/D-WcaLyb-54?si=6AsisySBPDn02Es2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <img src="https://static.snapchum.com/SC005/main-branded.png"><br/>
    <img src="https://static.snapchum.com/SC005/info1.png"><br/>
    <img src="https://static.snapchum.com/SC005/info2.png"><br/>
    <img src="https://static.snapchum.com/SC005/info3.png"><br/>
    <img src="https://static.snapchum.com/SC005/info4.png">
</p>'
where id='prod_01J7Z1XGYV736N63GEEG933MWR';

delete from product_images where product_id='prod_01J7Z1XGYV736N63GEEG933MWR';
insert into image (id, url) values ('img_01J7Z1XGYV736N63GEEG933MWR_main', 'https://static.snapchum.com/SC005/main-plain.png');
insert into image (id, url) values ('img_01J7Z1XGYV736N63GEEG933MWR_t1', 'https://static.snapchum.com/SC005/thumbnail1.png');
insert into image (id, url) values ('img_01J7Z1XGYV736N63GEEG933MWR_t2', 'https://static.snapchum.com/SC005/thumbnail2.png');
insert into image (id, url) values ('img_01J7Z1XGYV736N63GEEG933MWR_t3', 'https://static.snapchum.com/SC005/thumbnail3.png');
insert into image (id, url) values ('img_01J7Z1XGYV736N63GEEG933MWR_t4', 'https://static.snapchum.com/SC005/thumbnail4.png');

update product set thumbnail='https://static.snapchum.com/SC005/main-plain.png' where id='prod_01J7Z1XGYV736N63GEEG933MWR';

insert into product_images(product_id, image_id) values ('prod_01J7Z1XGYV736N63GEEG933MWR', 'img_01J7Z1XGYV736N63GEEG933MWR_main');
insert into product_images(product_id, image_id) values ('prod_01J7Z1XGYV736N63GEEG933MWR', 'img_01J7Z1XGYV736N63GEEG933MWR_t1');
insert into product_images(product_id, image_id) values ('prod_01J7Z1XGYV736N63GEEG933MWR', 'img_01J7Z1XGYV736N63GEEG933MWR_t2');
insert into product_images(product_id, image_id) values ('prod_01J7Z1XGYV736N63GEEG933MWR', 'img_01J7Z1XGYV736N63GEEG933MWR_t3');
insert into product_images(product_id, image_id) values ('prod_01J7Z1XGYV736N63GEEG933MWR', 'img_01J7Z1XGYV736N63GEEG933MWR_t4');

update product set status='published' where id='prod_01J7Z1XGYV736N63GEEG933MWR';

select * from product_variant where product_id='prod_01J7Z1XGYV736N63GEEG933MWR'
select * from product_option where product_id='prod_01J7Z1XGYV736N63GEEG933MWR'
update product_option set deleted_at=now()::date where id='opt_01J7Z1XGZ9WKN9TYVK9F8K98AR'
update product_variant set metadata='{"imgUrl":"https://static.snapchum.com/SC005/main-branded.png"}'::jsonb where product_id = 'prod_01J7Z1XGYV736N63GEEG933MWR'

----------------------------------------------------------------------------------------------------------------------------------

update product set 
title='Raspberry Pi 4 Model B - Advanced Miniature Computer for Learning and Innovation',
subtitle='Unleash your creativity with the Raspberry Pi 4 Model B, a powerful tiny computer for learning, programming, and experiencing the future of technology.',
handle='raspberry-pi',
description='<p>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/ZujzrGXoQH0?si=bSR6zklKM3yXkAj3?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <br/><img src="https://static.snapchum.com/SC009/main-branded.png">
    <br/><img src="https://static.snapchum.com/SC009/info1.png">
    <br/><img src="https://static.snapchum.com/SC009/info2.png">
    <br/><img src="https://static.snapchum.com/SC009/info3.png">
    <br/><img src="https://static.snapchum.com/SC009/info4.png">
</p>'
where id='prod_01J7ZZMP9WV591PHZ1BY8KW5ZB';

delete from product_images where product_id='prod_01J7ZZMP9WV591PHZ1BY8KW5ZB';
insert into image (id, url) values ('img_01J7ZZMP9WV591PHZ1BY8KW5ZB_main', 'https://static.snapchum.com/SC009/main-plain.png');
insert into image (id, url) values ('img_01J7ZZMP9WV591PHZ1BY8KW5ZB_t1', 'https://static.snapchum.com/SC009/thumbnail1.png');
insert into image (id, url) values ('img_01J7ZZMP9WV591PHZ1BY8KW5ZB_t2', 'https://static.snapchum.com/SC009/thumbnail2.png');
insert into image (id, url) values ('img_01J7ZZMP9WV591PHZ1BY8KW5ZB_t3', 'https://static.snapchum.com/SC009/thumbnail3.png');
insert into image (id, url) values ('img_01J7ZZMP9WV591PHZ1BY8KW5ZB_t4', 'https://static.snapchum.com/SC009/thumbnail4.png');

update product set thumbnail='https://static.snapchum.com/SC009/main-plain.png' where id='prod_01J7ZZMP9WV591PHZ1BY8KW5ZB';

insert into product_images(product_id, image_id) values ('prod_01J7ZZMP9WV591PHZ1BY8KW5ZB', 'img_01J7ZZMP9WV591PHZ1BY8KW5ZB_main');
insert into product_images(product_id, image_id) values ('prod_01J7ZZMP9WV591PHZ1BY8KW5ZB', 'img_01J7ZZMP9WV591PHZ1BY8KW5ZB_t1');
insert into product_images(product_id, image_id) values ('prod_01J7ZZMP9WV591PHZ1BY8KW5ZB', 'img_01J7ZZMP9WV591PHZ1BY8KW5ZB_t2');
insert into product_images(product_id, image_id) values ('prod_01J7ZZMP9WV591PHZ1BY8KW5ZB', 'img_01J7ZZMP9WV591PHZ1BY8KW5ZB_t3');
insert into product_images(product_id, image_id) values ('prod_01J7ZZMP9WV591PHZ1BY8KW5ZB', 'img_01J7ZZMP9WV591PHZ1BY8KW5ZB_t4');

update product set status='published' where id='prod_01J7ZZMP9WV591PHZ1BY8KW5ZB';

----------------------------------------------------------------------------------------------------------------------------------

update product set 
title='Mac Type C Adapter - High-Speed Transfer, Compact Design, Wide Compatibility',
subtitle='Revolutionize your connectivity with our Mac Type C Adapter, ensuring high-speed data transfer, compact portability, and wide-ranging compatibility.',
handle='mac-type-c-adapter',
description='<p>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/na1BcfeXAHw?si=Izsjk1_BmyIPijuj?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <br/><img src="https://static.snapchum.com/SC007/main-branded.png">
    <br/><img src="https://static.snapchum.com/SC007/lifestyle1.png">
    <br/><img src="https://static.snapchum.com/SC007/lifestyle2.png">
    <br/><img src="https://static.snapchum.com/SC007/info1.png">
    <br/><img src="https://static.snapchum.com/SC007/info2.png">
    <br/><img src="https://static.snapchum.com/SC007/info3.png">
    <br/><img src="https://static.snapchum.com/SC007/info4.png">
</p>'
where id='prod_01J831F9PS8Q42210GC6HTGGB4';

delete from product_images where product_id='prod_01J831F9PS8Q42210GC6HTGGB4';
insert into image (id, url) values ('img_01J831F9PS8Q42210GC6HTGGB4_main', 'https://static.snapchum.com/SC007/main-plain.png');
insert into image (id, url) values ('img_01J831F9PS8Q42210GC6HTGGB4_t1', 'https://static.snapchum.com/SC007/thumbnail1.png');
insert into image (id, url) values ('img_01J831F9PS8Q42210GC6HTGGB4_t2', 'https://static.snapchum.com/SC007/thumbnail2.png');
insert into image (id, url) values ('img_01J831F9PS8Q42210GC6HTGGB4_t3', 'https://static.snapchum.com/SC007/thumbnail3.png');
insert into image (id, url) values ('img_01J831F9PS8Q42210GC6HTGGB4_t4', 'https://static.snapchum.com/SC007/thumbnail4.png');

update product set thumbnail='https://static.snapchum.com/SC007/main-plain.png' where id='prod_01J831F9PS8Q42210GC6HTGGB4';

insert into product_images(product_id, image_id) values ('prod_01J831F9PS8Q42210GC6HTGGB4', 'img_01J831F9PS8Q42210GC6HTGGB4_main');
insert into product_images(product_id, image_id) values ('prod_01J831F9PS8Q42210GC6HTGGB4', 'img_01J831F9PS8Q42210GC6HTGGB4_t1');
insert into product_images(product_id, image_id) values ('prod_01J831F9PS8Q42210GC6HTGGB4', 'img_01J831F9PS8Q42210GC6HTGGB4_t2');
insert into product_images(product_id, image_id) values ('prod_01J831F9PS8Q42210GC6HTGGB4', 'img_01J831F9PS8Q42210GC6HTGGB4_t3');
insert into product_images(product_id, image_id) values ('prod_01J831F9PS8Q42210GC6HTGGB4', 'img_01J831F9PS8Q42210GC6HTGGB4_t4');

update product set status='published' where id='prod_01J831F9PS8Q42210GC6HTGGB4';

----------------------------------------------------------------------------------------------------------------------------------

update product set 
title='Magsafe Magnetic Power Bank 10000mAh- Portable, Two-Way Fast Charging',
subtitle='Meet your power needs with our Magsafe Magnetic 10,000mAh Power Bank. It offers two-way fast charging in a sleek, compact, and portable design.',
handle='magsafe-power-bank',
description='<p>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/9J7O8qrarFc?si=J8EIbI_rILfJIvyQ?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <br/><img src="https://static.snapchum.com/SC00prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ/main-branded.png">
    <br/><img src="https://static.snapchum.com/SC006/lifestyle1.png">
    <br/><img src="https://static.snapchum.com/SC006/lifestyle2.png">
    <br/><img src="https://static.snapchum.com/SC006/lifestyle3.png">
    <br/><img src="https://static.snapchum.com/SC006/info1.png">
    <br/><img src="https://static.snapchum.com/SC006/info2.png">
    <br/><img src="https://static.snapchum.com/SC006/info3.png">
    <br/><img src="https://static.snapchum.com/SC006/info4.png">
</p>'
where id='prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ';

delete from product_images where product_id='prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ';
insert into image (id, url) values ('img_01J7ZZJYC8VAACQ4M1P8KH0NQJ_main', 'https://static.snapchum.com/SC006/main-plain.png');
insert into image (id, url) values ('img_01J7ZZJYC8VAACQ4M1P8KH0NQJ_t1', 'https://static.snapchum.com/SC006/thumbnail1.png');
insert into image (id, url) values ('img_01J7ZZJYC8VAACQ4M1P8KH0NQJ_t2', 'https://static.snapchum.com/SC006/thumbnail2.png');
insert into image (id, url) values ('img_01J7ZZJYC8VAACQ4M1P8KH0NQJ_t3', 'https://static.snapchum.com/SC006/thumbnail3.png');
insert into image (id, url) values ('img_01J7ZZJYC8VAACQ4M1P8KH0NQJ_t4', 'https://static.snapchum.com/SC006/thumbnail4.png');

update product set thumbnail='https://static.snapchum.com/SC006/main-plain.png' where id='prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ';

insert into product_images(product_id, image_id) values ('prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ', 'img_01J7ZZJYC8VAACQ4M1P8KH0NQJ_main');
insert into product_images(product_id, image_id) values ('prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ', 'img_01J7ZZJYC8VAACQ4M1P8KH0NQJ_t1');
insert into product_images(product_id, image_id) values ('prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ', 'img_01J7ZZJYC8VAACQ4M1P8KH0NQJ_t2');
insert into product_images(product_id, image_id) values ('prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ', 'img_01J7ZZJYC8VAACQ4M1P8KH0NQJ_t3');
insert into product_images(product_id, image_id) values ('prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ', 'img_01J7ZZJYC8VAACQ4M1P8KH0NQJ_t4');

update product set status='published' where id='prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ';


----------------------------------------------------------------------------------------------------------------------------------

update product set 
title='DJ Drone Mavic for Superior Aerial Photography',
subtitle='Experience the cutting edge of aerial photography with the DJI Mavic Classic Drone. Built with a professional-grade camera, this drone is designed for exceptional image capture. Take to the skies and stay there with its long flight time. While in the air, its omnidirectional obstacle sensing, and pre-installed DJI Fly App on the HD display remote controller ensure safe and convenient operation.',
description='<p>
    <iframe style="width: 100%; aspect-ratio: 16 / 9" src="https://www.youtube.com/embed/sBfHYj-14XM?si=NhQ3xbCMOrVDLbKI?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <br/><img src="https://static.snapchum.com/SC014/main-branded.png">
    <br/><img src="https://static.snapchum.com/SC014/lifestyle1.png">
    <br/><img src="https://static.snapchum.com/SC014/lifestyle2.png">
    <br/><img src="https://static.snapchum.com/SC014/info1.png">
    <br/><img src="https://static.snapchum.com/SC014/info2.png">
    <br/><img src="https://static.snapchum.com/SC014/info3.png">
    <br/><img src="https://static.snapchum.com/SC014/info4.png">
</p>'
where id='prod_01J7XNT93Y86ZRPJ1C4JNN3502';

delete from product_images where product_id='prod_01J7XNT93Y86ZRPJ1C4JNN3502';
insert into image (id, url) values ('img_01J7XNT93Y86ZRPJ1C4JNN3502_main', 'https://static.snapchum.com/SC014/main-plain.png');
insert into image (id, url) values ('img_01J7XNT93Y86ZRPJ1C4JNN3502_t1', 'https://static.snapchum.com/SC014/thumbnail1.png');
insert into image (id, url) values ('img_01J7XNT93Y86ZRPJ1C4JNN3502_t2', 'https://static.snapchum.com/SC014/thumbnail2.png');
insert into image (id, url) values ('img_01J7XNT93Y86ZRPJ1C4JNN3502_t3', 'https://static.snapchum.com/SC014/thumbnail3.png');
insert into image (id, url) values ('img_01J7XNT93Y86ZRPJ1C4JNN3502_t4', 'https://static.snapchum.com/SC014/thumbnail4.png');

update product set thumbnail='https://static.snapchum.com/SC014/main-plain.png' where id='prod_01J7XNT93Y86ZRPJ1C4JNN3502';

insert into product_images(product_id, image_id) values ('prod_01J7XNT93Y86ZRPJ1C4JNN3502', 'img_01J7XNT93Y86ZRPJ1C4JNN3502_main');
insert into product_images(product_id, image_id) values ('prod_01J7XNT93Y86ZRPJ1C4JNN3502', 'img_01J7XNT93Y86ZRPJ1C4JNN3502_t1');
insert into product_images(product_id, image_id) values ('prod_01J7XNT93Y86ZRPJ1C4JNN3502', 'img_01J7XNT93Y86ZRPJ1C4JNN3502_t2');
insert into product_images(product_id, image_id) values ('prod_01J7XNT93Y86ZRPJ1C4JNN3502', 'img_01J7XNT93Y86ZRPJ1C4JNN3502_t3');
insert into product_images(product_id, image_id) values ('prod_01J7XNT93Y86ZRPJ1C4JNN3502', 'img_01J7XNT93Y86ZRPJ1C4JNN3502_t4');

update product set status='published' where id='prod_01J7XNT93Y86ZRPJ1C4JNN3502';

----------------------------------------------------------------------------------------------------------------------------------

update product set 
title='Xiaomi AirDots True Wireless Earbuds',
subtitle='Step into the world of seamless audio experience with Xiaomi AirDots. Designed with a bass-heavy sound signature and impressive bass extension, these earbuds are great for convenient and immersive listening on the go.',
description='<p>
    <iframe style="width: 100%; aspect-ratio: 16 / 9" src="https://www.youtube.com/embed/6LvfyLrjhbU?si=p1KZK9WQmRzoFR7D?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <br/><img src="https://static.snapchum.com/SC012/main-branded.png">
    <br/><img src="https://static.snapchum.com/SC012/lifestyle1.png">
    <br/><img src="https://static.snapchum.com/SC012/lifestyle2.png">
    <br/><img src="https://static.snapchum.com/SC012/info1.png">
    <br/><img src="https://static.snapchum.com/SC012/info2.png">
    <br/><img src="https://static.snapchum.com/SC012/info3.png">
    <br/><img src="https://static.snapchum.com/SC012/info4.png">
</p>' 
where id='prod_01J832DRXDG00HV0M7E10BRS0M';

delete from product_images where product_id='prod_01J832DRXDG00HV0M7E10BRS0M';
delete from image where id like '%01J832DRXDG00HV0M7E10BRS0M%'

insert into image (id, url) values ('img_01J832DRXDG00HV0M7E10BRS0M_main', 'https://static.snapchum.com/SC012/main-plain.png');
insert into image (id, url) values ('img_01J832DRXDG00HV0M7E10BRS0M_t1', 'https://static.snapchum.com/SC012/thumbnail1.png');
insert into image (id, url) values ('img_01J832DRXDG00HV0M7E10BRS0M_t2', 'https://static.snapchum.com/SC012/thumbnail2.png');
insert into image (id, url) values ('img_01J832DRXDG00HV0M7E10BRS0M_t3', 'https://static.snapchum.com/SC012/thumbnail3.png');
insert into image (id, url) values ('img_01J832DRXDG00HV0M7E10BRS0M_t4', 'https://static.snapchum.com/SC012/thumbnail4.png');

update product set thumbnail='https://static.snapchum.com/SC012/main-plain.png' where id='prod_01J832DRXDG00HV0M7E10BRS0M';

insert into product_images(product_id, image_id) values ('prod_01J832DRXDG00HV0M7E10BRS0M', 'img_01J832DRXDG00HV0M7E10BRS0M_main');
insert into product_images(product_id, image_id) values ('prod_01J832DRXDG00HV0M7E10BRS0M', 'img_01J832DRXDG00HV0M7E10BRS0M_t1');
insert into product_images(product_id, image_id) values ('prod_01J832DRXDG00HV0M7E10BRS0M', 'img_01J832DRXDG00HV0M7E10BRS0M_t2');
insert into product_images(product_id, image_id) values ('prod_01J832DRXDG00HV0M7E10BRS0M', 'img_01J832DRXDG00HV0M7E10BRS0M_t3');
insert into product_images(product_id, image_id) values ('prod_01J832DRXDG00HV0M7E10BRS0M', 'img_01J832DRXDG00HV0M7E10BRS0M_t4');

update product set status='published' where id='prod_01J832DRXDG00HV0M7E10BRS0M';

----------------------------------------------------------------------------------------------------------------------------------

update product set 
title='Premium HD Tempered Glass Screen Protector for iPhone 12 - 16 Pro',
subtitle='Experience premium screen protection with our Tempered Glass Film designed for various iPhone models. Our high-aluminum tempered glass film is HD, full-screen, and features anti-blue light technology. It is not easily breakable, providing robust protection for your mobile screen.',
handle='glass-screen-protector',
thumbnail='https://static.snapchum.com/SC011/main-plain.png',
description='<p>
    <iframe style="width: 100%; aspect-ratio: 16 / 9" src="https://www.youtube.com/embed/ou1R3GK2Nq4?si=sJYKPQjHuVJZ3oGW?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <br/><img src="https://static.snapchum.com/SC011/main-branded.png">
    <br/><img src="https://static.snapchum.com/SC011/lifestyle1.png">
    <br/><img src="https://static.snapchum.com/SC011/lifestyle2.png">
    <br/><img src="https://static.snapchum.com/SC011/info1.png">
    <br/><img src="https://static.snapchum.com/SC011/info2.png">
    <br/><img src="https://static.snapchum.com/SC011/info3.png">
    <br/><img src="https://static.snapchum.com/SC011/info4.png">
</p>'
where id='prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS';

delete from product_images where product_id='prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS';
insert into image (id, url) values ('img_01J7ZZRKEQSQW3HBRQQ1DMC5FS_main', 'https://static.snapchum.com/SC011/main-plain.png');
insert into image (id, url) values ('img_01J7ZZRKEQSQW3HBRQQ1DMC5FS_t1', 'https://static.snapchum.com/SC011/thumbnail1.png');
insert into image (id, url) values ('img_01J7ZZRKEQSQW3HBRQQ1DMC5FS_t2', 'https://static.snapchum.com/SC011/thumbnail2.png');
insert into image (id, url) values ('img_01J7ZZRKEQSQW3HBRQQ1DMC5FS_t3', 'https://static.snapchum.com/SC011/thumbnail3.png');
insert into image (id, url) values ('img_01J7ZZRKEQSQW3HBRQQ1DMC5FS_t4', 'https://static.snapchum.com/SC011/thumbnail4.png');

update product set thumbnail='https://static.snapchum.com/SC011/main-plain.png' where id='prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS';

insert into product_images(product_id, image_id) values ('prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS', 'img_01J7ZZRKEQSQW3HBRQQ1DMC5FS_main');
insert into product_images(product_id, image_id) values ('prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS', 'img_01J7ZZRKEQSQW3HBRQQ1DMC5FS_t1');
insert into product_images(product_id, image_id) values ('prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS', 'img_01J7ZZRKEQSQW3HBRQQ1DMC5FS_t2');
insert into product_images(product_id, image_id) values ('prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS', 'img_01J7ZZRKEQSQW3HBRQQ1DMC5FS_t3');
insert into product_images(product_id, image_id) values ('prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS', 'img_01J7ZZRKEQSQW3HBRQQ1DMC5FS_t4');

update product set status='published' where id='prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS';


update product_variant set metadata = ('{"imgUrl":"https://static.snapchum.com/SC011/main-plain.png"}')::jsonb where product_id='prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS'

----------------------------------------------------------------------------------------------------------------------------------

update product set 
title='Universal power strip',
subtitle='Looking for a one size fits all power strip? Then this has it - all types of plugs can fit - UK, US, as well as USB.',
handle='universal-power-strip',
thumbnail='https://static.snapchum.com/SC010/main-plain.png',
description='<p>
    <iframe style="width: 100%; aspect-ratio: 16 / 9" src="https://www.youtube.com/embed/XZtrCtvyycw?si=HIUol8SYa5w_GeGr?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</p>

<p>
    <br/><img src="https://static.snapchum.com/SC010/main-branded.png">
    <br/><img src="https://static.snapchum.com/SC010/lifestyle1.png">
    <br/><img src="https://static.snapchum.com/SC010/lifestyle2.png">
    <br/><img src="https://static.snapchum.com/SC010/info1.png">
    <br/><img src="https://static.snapchum.com/SC010/info2.png">
    <br/><img src="https://static.snapchum.com/SC010/info3.png">
    <br/><img src="https://static.snapchum.com/SC010/info4.png">
</p>'
where id='prod_01J9DWFCKGW2ZDZBARCCZD65ZM';

delete from product_images where product_id='prod_01J9DWFCKGW2ZDZBARCCZD65ZM';
insert into image (id, url) values ('img_01J9DWFCKGW2ZDZBARCCZD65ZM_main', 'https://static.snapchum.com/SC010/main-plain.png');
insert into image (id, url) values ('img_01J9DWFCKGW2ZDZBARCCZD65ZM_t1', 'https://static.snapchum.com/SC010/thumbnail1.png');
insert into image (id, url) values ('img_01J9DWFCKGW2ZDZBARCCZD65ZM_t2', 'https://static.snapchum.com/SC010/thumbnail2.png');
insert into image (id, url) values ('img_01J9DWFCKGW2ZDZBARCCZD65ZM_t3', 'https://static.snapchum.com/SC010/thumbnail3.png');
insert into image (id, url) values ('img_01J9DWFCKGW2ZDZBARCCZD65ZM_t4', 'https://static.snapchum.com/SC010/thumbnail4.png');

update product set thumbnail='https://static.snapchum.com/SC010/main-plain.png' where id='prod_01J9DWFCKGW2ZDZBARCCZD65ZM';

insert into product_images(product_id, image_id) values ('prod_01J9DWFCKGW2ZDZBARCCZD65ZM', 'img_01J9DWFCKGW2ZDZBARCCZD65ZM_main');
insert into product_images(product_id, image_id) values ('prod_01J9DWFCKGW2ZDZBARCCZD65ZM', 'img_01J9DWFCKGW2ZDZBARCCZD65ZM_t1');
insert into product_images(product_id, image_id) values ('prod_01J9DWFCKGW2ZDZBARCCZD65ZM', 'img_01J9DWFCKGW2ZDZBARCCZD65ZM_t2');
insert into product_images(product_id, image_id) values ('prod_01J9DWFCKGW2ZDZBARCCZD65ZM', 'img_01J9DWFCKGW2ZDZBARCCZD65ZM_t3');
insert into product_images(product_id, image_id) values ('prod_01J9DWFCKGW2ZDZBARCCZD65ZM', 'img_01J9DWFCKGW2ZDZBARCCZD65ZM_t4');



update product_variant set metadata = ('{"imgUrl":"https://static.snapchum.com/SC010/main-plain.png"}')::jsonb where product_id='prod_01J9DWFCKGW2ZDZBARCCZD65ZM'


----------------------------------------------------------------------------------------------------------------------------------





select * from product where handle like 'xiao%'
select * from product_images where product_id='img_01J832DRXDG00HV0M7E10BRS0M_t2'

select * from image where id like '%01J832DRXDG00HV0M7E10BRS0M%'
select 
ma.id,
--pv.title, 
----pvma.id, 
--ma.currency_code,
ma.amount
from product_variant pv 
left outer join product_variant_money_amount pvma on pv.id = pvma.variant_id
left outer join money_amount ma on ma.id = pvma.money_amount_id
where pv.product_id='prod_01J7Z1XGYV736N63GEEG933MWR' and ma.currency_code='usdc'


------------------------------------------------------------------------------------------------------------------

update money_amount set amount = 991 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J7WWNVCB2XX2PB372QNNDXEF'
)) and currency_code='usdc'

update money_amount set amount = 1280 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J8326VDM2A8S8R8HGT7F1TCW'
)) and currency_code='usdc'

update money_amount set amount = 1140 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J8319HHATQ2CWH70VQR2VG9T'
)) and currency_code='usdc'

update money_amount set amount = 6837 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J831AS9B4R9PPSGV1NSZ4T1K'
)) and currency_code='usdc'

update money_amount set amount = 1990 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J7Z1XGYV736N63GEEG933MWR'
)) and currency_code='usdc'

update money_amount set amount = 2999 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ'
)) and currency_code='usdc'

update money_amount set amount = 970 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J831F9PS8Q42210GC6HTGGB4'
)) and currency_code='usdc'

update money_amount set amount = 9990 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J7ZZMP9WV591PHZ1BY8KW5ZB'
)) and currency_code='usdc'

update money_amount set amount = 2000 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J832DRXDG00HV0M7E10BRS0M'
)) and currency_code='usdc'

update money_amount set amount = 41900 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J832CXAZKYHEDSFKET0C8JWB'
)) and currency_code='usdc'

update money_amount set amount = 24900 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J7XNT93Y86ZRPJ1C4JNN3502'
)) and currency_code='usdc'

update money_amount set amount = 305 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS'
)) and currency_code='usdc'

update money_amount set amount = 1686 where id in (
select money_amount_id from product_variant_money_amount where variant_id in (
    select id from product_variant where product_id='prod_01J9DWFCKGW2ZDZBARCCZD65ZM'
)) and currency_code='usdc'