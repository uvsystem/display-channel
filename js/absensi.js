$( document ).ready( function () {

	// Halaman awal adalah rekap
	pageName = 'rekap';
	data.pilih = 'bagian';

	loadDefaultLoader();

	page.load( $( '#content-absen' ), 'html/rekap.html');
	page.load( $( '#option-panel' ), 'html/rekap-option.html' );
	
	$( '#absen-tanggal-awal' ).val( myDate.getAwalDatePicker() );
	$( '#absen-tanggal-akhir' ).val( myDate.getAkhirDatePicker() );
	
	_rekap.load();

	// Handler
	$( document ).on( 'click', '#btn-rekap', function() {

		pageName = 'rekap';

		loadDefaultLoader();

		page.load( $( '#content-absen' ), 'html/rekap.html');
		page.load( $( '#option-panel' ), 'html/rekap-option.html' );
	
		$( '#absen-tanggal-awal' ).val( myDate.getAwalDatePicker() );
		$( '#absen-tanggal-akhir' ).val( myDate.getAkhirDatePicker() );
		
		clearTimeout( data.timeoutVar );
		
		data.loaderNumber = 0;
		
		_rekap.load();
		
	} );

	$( document ).on( 'click', '#btn-ranking', function() {

		pageName = 'ranking';
		
		loadSkpd();
		
		page.load( $( '#content-absen' ), 'html/ranking.html');
		page.load( $( '#option-panel' ), 'html/ranking-option.html' );
	
		$( '#absen-tanggal-awal' ).val( myDate.getAwalDatePicker() );
		$( '#absen-tanggal-akhir' ).val( myDate.getAkhirDatePicker() );
		
		clearTimeout( data.timeoutVar );
		
		data.loaderNumber = 0;
		
		_ranking.load();

	} );
	
	$( document ).on( 'change', '#absen-tanggal-awal', function() {

		clearTimeout( data.timeoutVar );

		if ( pageName == 'rekap') {
			_rekap.load();
		} else {
			_ranking.load();
		}
		
	} );

	$( document ).on( 'change', '#absen-tanggal-akhir', function() {

		clearTimeout( data.timeoutVar );

		if ( pageName == 'rekap') {
			_rekap.load();
		} else {
			_ranking.load();
		}
		
	} );

	$( document ).on( 'change', '#absen-pilih', function() {

		clearTimeout( data.timeoutVar );

		data.pilih = $( '#absen-pilih' ).val();
		
		if ( !data.pilih)
			return;
		
		if ( data.pilih == 'skpd' ) {

			data.pilih = 'skpd';
			loadSkpd();
			
		} else if ( data.pilih == 'bagian' ) {

			data.pilih = 'bagian';
			
			if ( pageName == 'rekap') {
				
				loadDefaultLoader();
				
			} else {
				
				loadSkpd();
				
			}
			
		}
		
		data.loaderNumber = 0;

		if ( pageName == 'rekap') {
			_rekap.load();
		} else {
			_ranking.load();
		}
		
	} );
});

function loadDefaultLoader() {
	
	var tmpLoader = [];
	loadBagian( 5 ); // Untuk semua bagian dalam suatu skpd
	tmpLoader = joinList( tmpLoader, listLoader );
	loadBagian( 6 ); // Untuk semua bagian dalam suatu skpd
	tmpLoader = joinList( tmpLoader, listLoader );
	loadBagian( 7 ); // Untuk semua bagian dalam suatu skpd
	tmpLoader = joinList( tmpLoader, listLoader );
	
	listLoader = tmpLoader;
	
};

function joinList( list1, list2 ) {

	if ( !list2 )
		return list1;
	
	var firstIndex = list1.length;
	var index = 0;
	for ( index = 0; index < list2.length; index++ ) {
		
		list1[ firstIndex ] = list2[ index ];
		firstIndex++;
		
	}
	
	return list1;
	
};


// Load data SKPD ke dalam list.
function loadSkpd() {

	var object = {
		path: '/skpd',
		data: { },
		method: 'GET',
		success: function( result ) {

			if ( result.tipe == 'LIST' )
				listLoader = result.list;

		},
		error: message.error
	};

	rest.callAjaxFree( object );
};

// Load data Bagian (berdasarkan skpd) ke dalam list.
function loadBagian( idSkpd ) {

	var object = {
		path: '/bagian',
		data: { },
		method: 'GET',
		success: function( result ) {

			if ( result.tipe == 'LIST' )
				listLoader = result.list;

		},
		error: message.error
	};
		
	// Load bagian berdasarkan skpd, jika idSkpd ditemukan
	if ( idSkpd )
		object.path = '/bagian/skpd/' + idSkpd;
		
	rest.callAjaxFree( object );
};
	
var listLoader = [ ];
var pageName = 'rekap';

function reloadLoadNumber( container ) {
				
	if ( ( data.loaderNumber + 1 ) < listLoader.length ) {
					
		data.loaderNumber++;
					
	} else {
					
		data.loaderNumber = 0;
					
	}
				
	container.load();
				
};

function getColor( presentase ) {
	
	if ( presentase > 80 )
		return 'success';
	if ( presentase > 60 )
		return 'warning';
	return 'error';
};

	
var data = {
	idSkpd: null, // Ganti null dengan id, jika spesifik untuk SKPD tertentu
	tableSize: 4, // Jumlah table untuk setiap waktu
	hariKerja: 22,
	currentPage: 0,
	pilih: 'skpd',
	tanggalAwal: myDate.getNow(),
	tanggalAkhir: myDate.getNow(),
	loaderNumber: 0, // Load mulai dari 0
	timeout: 10000, // Rentang waktu untuk berganti data absen
	timeoutVar: '',
	hariKerja: {
		januari: 22,
		februari: 22,
		maret: 22,
		april: 22,
		mei: 22,
		juni: 22,
		juli: 22,
		agustus: 22,
		september: 22,
		oktober: 22,
		november: 22,
		desember: 22,
			
		get: function( tanggal ) {
				
			var date = myDate.fromDatePicker( tanggal );

			switch( date.month ) {
				case '01': return this.januari;
				case '02': return this.februari;
				case '03': return this.maret;
				case '04': return this.april;
				case '05': return this.mei;
				case '06': return this.juni;
				case '07': return this.juli;
				case '08': return this.agustus;
				case '09': return this.september;
				case '10': return this.oktober;
				case '11': return this.november;
				case '12': return this.desember;
			}
		}
	}
		
};
	
var _rekap = {

	load: function loadRekap() {
			
		var tmp = listLoader[ data.loaderNumber ];
			
		_rekap.loadData( tmp.id);
			
	},

	loadData:	function ( id ) {

		var awal = myDate.formatDatePicker( $( '#absen-tanggal-awal' ).val() );
		var akhir = myDate.formatDatePicker( $( '#absen-tanggal-akhir' ).val() );

		var object = {
			path: '/pegawai/rekap/bagian/' + id + '/' + awal + '/' + akhir,
			data: { },
			method: 'GET',
			success: function( result ) {

				if ( result.tipe == 'LIST' ) {

					_rekap.setData( result.list, 0 );
						
				} else {
						
					reloadLoadNumber( _rekap );
						
				}
			},
			error: message.error
		};

		if ( data.pilih == 'skpd' )
			object.path ='/pegawai/rekap/skpd/' + id + '/' + awal + '/' + akhir;

		rest.callAjaxFree( object );

	},
		
	setData: function ( list, pageNumber ) {

		var tanggalAwal = $( '#absen-tanggal-awal' ).val();
			
		var html = '';

		var base = ( pageNumber * data.tableSize);
		var top = base + data.tableSize;

		if ( top > list.length )
			top = list.length;
			
		for ( var i = base; i < top; i++ ) {

			var tmp = list[ i ];
				
		$( '#nama-skpd' ).html( tmp.bagian.skpd.nama );			
		$( '#nama-bagian' ).html( tmp.bagian.nama );
				
		if ( data.pilih == 'skpd' )
			$( '#nama-bagian' ).html( 'Semua Bagian' );

			var presentase = Math.round( ( ( tmp.hadir / data.hariKerja.get( tanggalAwal ) ) * 100 ) );
		
			var color = getColor( presentase );
				
			html += '<tr class="' + color + '">' +
				'<td>' + tmp.nip + '</td>' +
				'<td>' + tmp.nama + '</td>' +
				'<td>' + tmp.jabatan + '</td>' +
				'<td>' + data.hariKerja.get( tanggalAwal ) + '</td>' +
				'<td>' + tmp.hadir + '</td>' +
				'<td>' + tmp.terlambat + '</td>' +
				'<td>' + tmp.pulang + '</td>' +
				'<td>' + tmp.sakit + '</td>' +
				'<td>' + tmp.izin + '</td>' +
				'<td>' + tmp.cuti + '</td>' +
				'<td>' + presentase + ' %</td>' +
				'</tr>';
		}

		page.change( $( '#table-rekap' ), html );
			
		var sisa = list.length - ( top );

		if ( sisa > 0 ) {
				
			var reload = function() {
					
				_rekap.setData( list, ++pageNumber );
					
			}

			data.timeoutVar = setTimeout( reload, data.timeout);
				
		} else {
				
			data.timeoutVar = setTimeout( function() { 
				reloadLoadNumber( _rekap );
			}, data.timeout);
				
		}
	}
		
};

var _ranking = {

	load: function() {
			
		var tmp = listLoader[ data.loaderNumber ];
			
		_ranking.loadData( tmp.id);			

	},
	
	loadData: function( id ) {

		var awal = myDate.formatDatePicker( $( '#absen-tanggal-awal' ).val() );
		var akhir = myDate.formatDatePicker( $( '#absen-tanggal-akhir' ).val() );

		var object = {
			path: '/bagian/rekap/' + id + '/' + awal + '/' + akhir,
			data: { },
			method: 'GET',
			success: function( result ) {

				if ( result.tipe == 'LIST' ) {

					_ranking.setData( result.list, 0 );
						
				} else {
						
					reloadLoadNumber( _ranking );
						
				}
			},
			error: message.error
		};

		if ( data.pilih == 'skpd' )
			object.path ='/skpd/rekap/' + awal + '/' + akhir;

		rest.callAjaxFree( object );

	},
	
	setData: function( list, pageNumber ) {

		var tanggalAwal = $( '#absen-tanggal-awal' ).val();
			
		var html = '';

		var base = ( pageNumber * data.tableSize);
		var top = base + data.tableSize;

		if ( top > list.length )
			top = list.length;
			
		for ( var i = base; i < top; i++ ) {

			var tmp = list[ i ];

			var presentase = Math.round( ( ( tmp.hadir / ( tmp.jumlahPegawai * data.hariKerja.get( tanggalAwal ) ) ) * 100 ) );
								
			// Ubah Nama SKPD pada kanan atas
			if ( data.pilih == 'skpd' ) {
				
				$( '#nama-skpd' ).html( 'Semua SKPD' );
				$( '#nama-bagian' ).html( 'Semua Bagian' );
		
				var color = getColor( presentase );
					
				html += '<tr class="' + color + '">' +
					'<td>' + tmp.nama + '</td>' +
					'<td>Semua</td>' +
					'<td>' + tmp.jumlahPegawai + '</td>' +
					'<td>' + presentase + ' %</td>' +
					'</tr>';
				
			} else {
				
				$( '#nama-skpd' ).html( tmp.skpd.nama );
				$( '#nama-bagian' ).html( 'Semua Bagian' );
		
				var color = getColor( presentase );
					
				html += '<tr class="' + color + '">' +
					'<td>' + tmp.skpd.nama + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + tmp.jumlahPegawai + '</td>' +
					'<td>' + presentase + ' %</td>' +
					'</tr>';
				
			}
			
		}

		page.change( $( '#table-rekap' ), html );
			
		var sisa = list.length - ( top );

		if ( sisa > 0 ) {
				
			var reload = function() {
					
				_ranking.setData( list, ++pageNumber );
					
			}

			data.timeoutVar = setTimeout( reload, data.timeout);
				
		} else {
				
			data.timeoutVar = setTimeout( function() { 
				reloadLoadNumber( _ranking );
			}, data.timeout);
				
		}
	}
	
};
