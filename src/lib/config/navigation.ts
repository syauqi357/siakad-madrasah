export interface NavItem {
	name: string;
	href: string;
	icon?: string;
	hasDropdown?: boolean;
	children?: NavChild[];
}

export interface NavChild {
	name: string;
	href: string;
	icon?: string;
}

export type UserRole = 'admin' | 'teacher';
export interface User {
	id: number;
	username: string;
	email: string;
	role: UserRole;
}

export const navigationConfig: Record<UserRole, NavItem[]> = {
	admin: [
		{
			name: 'Dashboard',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M520-640v-160q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v160q0 17-11.5 28.5T800-600H560q-17 0-28.5-11.5T520-640ZM120-480v-320q0-17 11.5-28.5T160-840h240q17 0 28.5 11.5T440-800v320q0 17-11.5 28.5T400-440H160q-17 0-28.5-11.5T120-480Zm400 320v-320q0-17 11.5-28.5T560-520h240q17 0 28.5 11.5T840-480v320q0 17-11.5 28.5T800-120H560q-17 0-28.5-11.5T520-160Zm-400 0v-160q0-17 11.5-28.5T160-360h240q17 0 28.5 11.5T440-320v160q0 17-11.5 28.5T400-120H160q-17 0-28.5-11.5T120-160Zm80-360h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>',
			href: '/dashboard'
		},
		{
			name: 'sarana prasarana',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-400q0-33 23.5-56.5T200-680h80v-80q0-33 23.5-56.5T360-840h240q33 0 56.5 23.5T680-760v240h80q33 0 56.5 23.5T840-440v240q0 33-23.5 56.5T760-120H520v-160h-80v160H200Zm0-80h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm160 160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm160 320h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm160 480h80v-80h-80v80Zm0-160h80v-80h-80v80Z"/></svg>',
			href: '/sarpras',
			hasDropdown: true,
			children: [
				{ name: 'aset tetap', icon: '', href: '/sarpras/assettetap' },
				{ name: 'aset lancar', icon: '', href: '/sarpras/asetlancar' },
				{ name: 'perpustakaan', icon: '', href: '/sarpras/perpustakaan' },
				{ name: 'rekapitulasi', icon: '', href: '/lembaga' }
			]
		},
		{
			name: 'siswa',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M242-249q-20-11-31-29.5T200-320v-192l-96-53q-11-6-16-15t-5-20q0-11 5-20t16-15l338-184q9-5 18.5-7.5T480-829q10 0 19.5 2.5T518-819l381 208q10 5 15.5 14.5T920-576v256q0 17-11.5 28.5T880-280q-17 0-28.5-11.5T840-320v-236l-80 44v192q0 23-11 41.5T718-249L518-141q-9 5-18.5 7.5T480-131q-10 0-19.5-2.5T442-141L242-249Zm238-203 274-148-274-148-274 148 274 148Zm0 241 200-108v-151l-161 89q-9 5-19 7.5t-20 2.5q-10 0-20-2.5t-19-7.5l-161-89v151l200 108Zm0-241Zm0 121Zm0 0Z"/></svg>',
			href: '/siswa',
			hasDropdown: true,
			children: [
				{ name: 'daftar siswa', icon: '', href: '/siswa' },
				{ name: 'Alumni', href: '/siswa/alumni' },
				{ name: 'Mutasi keluar', href: '/siswa/mutasi-keluar' },
				{ name: 'Mutasi masuk', href: '/siswa/mutasi-masuk' },
				{ name: 'Kenaikan Kelas', href: '/siswa/kenaikan-kelas' },
				{ name: 'Siswa Ganda', href: '/siswa/siswa-ganda' },
				{ name: 'PIP/KIP-K/Beasiswa', href: '/siswa/beasiswa' }
			]
		},
		{
			name: 'Rombel',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h440q19 0 36 8.5t28 23.5l180 240q16 21 16 48t-16 48L664-192q-11 15-28 23.5t-36 8.5H160Zm0-80h440l180-240-180-240H160v480Zm310-240Z"/></svg>',
			href: '/rombel'
		},
		{
			name: 'guru & tendik',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m424-430-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-430ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-590q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z"/></svg>',
			href: '/gurutendik',
			hasDropdown: true,
			children: [
				{ name: 'daftar GTK', href: '/gurutendik/daftar-gtk' },
				{ name: 'pengajuan GTK', href: '/gurutendik/ajuan-gtk' },
				{ name: 'mutasi', href: '/gurutendik/mutasi' },
				{ name: 'akun', href: '/gurutendik/akun' }
			]
		},
		{
			name: 'nilai siswa',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M160-200h160v-320H160v320Zm240 0h160v-560H400v560Zm240 0h160v-240H640v240Zm-560 0v-320q0-33 23.5-56.5T160-600h160v-160q0-33 23.5-56.5T400-840h160q33 0 56.5 23.5T640-760v240h160q33 0 56.5 23.5T880-440v240q0 33-23.5 56.5T800-120H160q-33 0-56.5-23.5T80-200Z"/></svg>',
			href: '/score',
			hasDropdown: true,
			children: [
				{ name: 'nilai', icon: '', href: '/score' },
				{ name: 'ujian', icon: '', href: '/score/exam' },
				{ name: 'tugas', icon: '', href: '/score/task' },
				{ name: 'mata pelajaran', icon: '', href: '/score/subject' },
				{ name: 'kenaikan kelas', icon: '', href: '/score/upgrade' }
			]
		},
		{
			name: 'konfirmasi',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m438-513-29-29q-12-11-28-11t-28 12q-12 12-12 28t12 28l56 57q12 12 28.5 12t28.5-12l141-142q12-12 12-28t-12-28q-12-12-28-12t-28 12L438-513Zm42 273-168 72q-40 17-76-6.5T200-241v-519q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v519q0 43-36 66.5t-76 6.5l-168-72Zm0-88 200 86v-518H280v518l200-86Zm0-432H280h400-200Z"/></svg>',
			href: '/confirm',
			hasDropdown: true,
			children: [
				{ name: 'kelembagaan', icon: '', href: '/confirm/lembaga' },
				{ name: 'sarana prasarana', icon: '', href: '/confirm/sarpras' },
				{ name: 'siswa', icon: '', href: '/confirm/studentdata' },
				{ name: 'guru tendik', icon: '', href: '/confirm/teacher' }
			]
		},
		{
			name: 'info lainnya',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
			href: '/info',
			hasDropdown: true,
			children: [
				{ name: 'daftar kurikulum', icon: '', href: '/info/curriculum' },
				{ name: 'hari sekolah', icon: '', href: '/info/daysch' }
			]
		},
		{
			name: 'Audit Logs',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m520-496 120 120q11 11 11 28t-11 28q-11 11-28 11t-28-11L452-452q-6-6-9-13.5t-3-15.5v-159q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640v144Zm90-264q-21 0-35.5-14.5T560-810q0-21 14.5-35.5T610-860q21 0 35.5 14.5T660-810q0 21-14.5 35.5T610-760Zm0 660q-21 0-35.5-14.5T560-150q0-21 14.5-35.5T610-200q21 0 35.5 14.5T660-150q0 21-14.5 35.5T610-100Zm160-520q-21 0-35.5-14.5T720-670q0-21 14.5-35.5T770-720q21 0 35.5 14.5T820-670q0 21-14.5 35.5T770-620Zm0 380q-21 0-35.5-14.5T720-290q0-21 14.5-35.5T770-340q21 0 35.5 14.5T820-290q0 21-14.5 35.5T770-240Zm60-190q-21 0-35.5-14.5T780-480q0-21 14.5-35.5T830-530q21 0 35.5 14.5T880-480q0 21-14.5 35.5T830-430ZM80-480q0-157 104.5-270T441-878q16-2 27.5 9.5T480-840q0 16-10.5 28T443-798q-121 14-202 104t-81 214q0 125 81 214.5T443-162q16 2 26.5 14t10.5 28q0 17-11.5 28.5T441-82Q288-97 184-210T80-480Z"/></svg>',
			href: '/admin/audit_logs'
		}
	],

	teacher: [
		{
			name: 'Dashboard',
			icon: '',
			href: '/dashboard'
		},
		{
			name: 'sarana prasarana',
			icon: '',
			href: '/sarpras',
			hasDropdown: true,
			children: [
				{ name: 'aset tetap', icon: '', href: '/sarpras/assettetap' },
				{ name: 'aset lancar', icon: '', href: '/sarpras/asetlancar' },
				{ name: 'perpustakaan', icon: '', href: '/sarpras/perpustakaan' }
			]
		},
		{
			name: 'Student',
			icon: '',
			href: '/siswa',
			hasDropdown: true,
			children: [
				{ name: 'Student List', icon: '', href: '/siswa' },
				{ name: 'Alumni', icon: '', href: '/siswa/alumni' }
			]
		},
		{
			name: 'Rombel',
			icon: '',
			href: '/rombel'
		},
		{
			name: 'nilai siswa',
			icon: '',
			href: '/score',
			hasDropdown: true,
			children: [
				{ name: 'ujian', icon: '', href: '/score/exam' },
				{ name: 'tugas', icon: '', href: '/score/task' },
				{ name: 'mata pelajaran', icon: '', href: '/score/subject' }
			]
		},
		{
			name: 'info lainnya',
			icon: '',
			href: '/info',
			hasDropdown: true,
			children: [
				{ name: 'daftar kurikulum', icon: '', href: '/info/curriculum' },
				{ name: 'hari sekolah', icon: '', href: '/info/daysch' }
			]
		}
	]
};
