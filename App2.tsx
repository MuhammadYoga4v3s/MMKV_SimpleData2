// import React, {useState, useEffect} from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
//   Alert,
// } from 'react-native';

// // Alat utama untuk Autentikasi, Database, dan MMKV
// import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import {MMKV} from 'react-native-mmkv'; // Implementasi MMKV

// // 1. INISIALISASI MMKV 
// export const storage = new MMKV({id: 'tugas-data-storage'});

// // Warna primer
// const PRIMARY_COLOR = '#0056b3'; 
// const SECONDARY_COLOR = '#28a745'; 

// // ========================================================================
// // Halaman Utama (Daftar Data)
// // ========================================================================
// function HomeScreen({onLogout, userEmail}) { 
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // TUGAS 3: Mengambil data dari Firestore (Persistence by Firebase Rules)
//     const subscriber = firestore()
//       .collection('mahasiswa') // Mengambil data dari koleksi 'mahasiswa'
//       .onSnapshot(querySnapshot => {
//         const collectedData = [];
//         querySnapshot.forEach(documentSnapshot => {
//           collectedData.push({...documentSnapshot.data(), id: documentSnapshot.id});
//         });
//         setData(collectedData);
//         setLoading(false);
//       });
//     return () => subscriber();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color={PRIMARY_COLOR} />
//         <Text style={styles.loadingText}>Mohon tunggu, memuat data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.homeContainer}>
//       <Text style={styles.title}>Daftar Data Mahasiswa</Text>
//       <Text style={styles.loggedInText}>Sesi Aktif: {userEmail}</Text>
      
//       <FlatList
//         data={data}
//         keyExtractor={item => item.id}
//         renderItem={({item}) => (
//           <View style={styles.itemBox}>
//             <Text style={styles.itemLabel}>Nama: <Text style={styles.itemValue}>{item.Nama || '-'}</Text></Text>
//             <Text style={styles.itemLabel}>NIM: <Text style={styles.itemValue}>{item.NIM || '-'}</Text></Text>
//             <Text style={styles.itemLabel}>Program Studi: <Text style={styles.itemValue}>{item.Prodi || '-'}</Text></Text>
//             <Text style={styles.itemLabel}>Angkatan: <Text style={styles.itemValue}>{item.Angkatan || '-'}</Text></Text>
//             <Text style={styles.itemLabel}>Email: <Text style={styles.itemValue}>{item.Email || '-'}</Text></Text>
//           </View>
//         )}
//       />
//       <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
//         <Text style={styles.buttonText}>Keluar Sesi (Logout)</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// // ========================================================================
// // Halaman Login / Register
// // ========================================================================
// function LoginScreen({onLoginSuccess}) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleRegister = () => {
//     if (!email || !password) {
//       Alert.alert('Gagal', 'Email dan Kata Sandi tidak boleh kosong.');
//       return;
//     }
//     setLoading(true);
//     auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then(() => {
//         Alert.alert('Sukses', 'Akun berhasil didaftarkan! Silakan masuk.');
//         setLoading(false);
//       })
//       .catch(error => {
//         Alert.alert('Gagal Daftar', error.message);
//         setLoading(false);
//       });
//   };

//   const handleLogin = () => {
//     // TUGAS 1: Implementasi Firebase Auth
//     if (!email || !password) {
//       Alert.alert('Gagal', 'Email dan Kata Sandi tidak boleh kosong.');
//       return;
//     }
//     setLoading(true);
//     auth()
//       .signInWithEmailAndPassword(email, password)
//       .then(userCredential => {
//         const user = userCredential.user;
        
//         // TUGAS 1: Simpan Persistence ke MMKV
//         storage.set('user.email', user.email);
        
//         Alert.alert('Sukses', 'Berhasil masuk!');
//         setLoading(false);
//         onLoginSuccess(user);
//       })
//       .catch(error => {
//         Alert.alert('Gagal Masuk', error.message);
//         setLoading(false);
//       });
//   };

//   return (
//     <View style={styles.centerContainer}>
//       <Text style={styles.title}>Masuk / Daftar Akun</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Alamat Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Kata Sandi"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       {loading ? (
//         <ActivityIndicator size="large" color={PRIMARY_COLOR} />
//       ) : (
//         <>
//           <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//             <Text style={styles.buttonText}>Masuk (Login)</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.registerButton}
//             onPress={handleRegister}>
//             <Text style={styles.buttonText}>Buat Akun Baru</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// }

// // ========================================================================
// // Komponen UTAMA (App)
// // ========================================================================
// function App(): React.JSX.Element {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

//   // Handle user state changes (Hanya untuk memantau status logout dari Firebase)
//   function onAuthStateChanged(fbUser: FirebaseAuthTypes.User | null) {
//     if (!fbUser) {
//         // Jika user logout dari Firebase, kita juga hapus dari MMKV
//         storage.delete('user.email');
//         setUser(null);
//     }
//     if (initializing) {
//       setInitializing(false);
//     }
//   }

//   useEffect(() => {
//     // Cek MMKV untuk persistence login yang cepat
//     const mmkvUserEmail = storage.getString('user.email');
//     if (mmkvUserEmail) {
//         // Jika ada di MMKV, langsung dianggap login (MMKV lebih cepat dari Firebase listener)
//         setUser({email: mmkvUserEmail} as FirebaseAuthTypes.User);
//         setInitializing(false);
//     }

//     // Listener Firebase Auth (hanya untuk menangani event logout/token)
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; 
//   }, []);

//   const onLoginSuccess = (loggedInUser: FirebaseAuthTypes.User) => {
//       // Dipanggil dari LoginScreen
//       setUser(loggedInUser);
//   };

//   const handleLogout = () => {
//     // Hapus data dari MMKV
//     storage.delete('user.email');
    
//     setUser(null);
//     auth().signOut();
//   };

//   if (initializing) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color={PRIMARY_COLOR} />
//         <Text style={styles.loadingText}>Memuat konfigurasi...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.mainContainer}>
//       {user ? (
//         <HomeScreen onLogout={handleLogout} userEmail={user.email} />
//       ) : (
//         <LoginScreen onLoginSuccess={onLoginSuccess} />
//       )}
//     </SafeAreaView>
//   );
// }

// // STYLING
// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   homeContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: '#333',
//   },
//   loggedInText: {
//     fontSize: 13,
//     marginBottom: 20,
//     textAlign: 'center',
//     color: 'gray',
//     fontStyle: 'italic',
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#333',
//   },
//   input: {
//     height: 50,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 15,
//     paddingHorizontal: 15,
//     backgroundColor: 'white',
//     width: '100%',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   loginButton: {
//     backgroundColor: PRIMARY_COLOR,
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//     width: '100%',
//   },
//   registerButton: {
//     backgroundColor: SECONDARY_COLOR,
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//     width: '100%',
//   },
//   logoutButton: {
//     backgroundColor: '#dc3545', // Merah untuk logout
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   itemBox: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 12,
//     elevation: 2,
//   },
//   itemLabel: {
//     fontSize: 14,
//     color: '#666',
//     lineHeight: 20,
//   },
//   itemValue: {
//     fontSize: 15,
//     color: '#333',
//     fontWeight: '500',
//   },
// });

// export default App;