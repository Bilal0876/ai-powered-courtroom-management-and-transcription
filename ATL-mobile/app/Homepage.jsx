import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import logo from './automated-trial-log-logo-v5.png';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Homepage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                const parsedUser = storedUser ? JSON.parse(storedUser) : null;
                if (parsedUser) {
                    setUser(parsedUser);
                    fetch("http://10.134.204.206:3000/judge-profile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: parsedUser.email,
                            // role: parsedUser.role,
                        }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.success && data.user) {
                                setUser(prev => ({
                                    ...prev,
                                    ...data.user
                                }));
                            }

                        }).catch((err) => console.error("❌ Error fetching judge profile:", err));
                }

            } catch (error) {
                console.error("Error loading user:", error);
            }
        };

        loadUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("user");
        router.replace("/LoginPage");
    };

    if (!user) return <Text style={{ textAlign: "center", marginTop: 50 }}>Loading...</Text>;

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.Header}>
                <Image
                    source={logo}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Automated Trial Log</Text>
                <Text style={styles.subTitle}>
                    Department of Social Justice | Government of Punjab
                </Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.name}>Justice {user.name}</Text>
                    <Text style={styles.detail}>
                        Judge - {user.court}
                    </Text>
                    <Text style={styles.detail}>
                        Judge ID : {user.id}
                    </Text>
                    <Text>
                        <Text style={styles.time}>Today: </Text>
                        {new Date().toLocaleDateString('en-PK', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                <View style={[styles.card2, styles.transcriptions]}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Case Schedules & Transcripts</Text>
                    </View>

                    <View style={styles.cardBody}>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionBtn]}
                                onPress={() => router.push('CaseSchedule')}
                            >
                                <Text style={styles.btnText}>Case Schedules</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => router.push('ChoosesCaseForTranscript')}
                            >
                                <Text style={styles.btnText}>View Transcripts</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => router.push('ChoosesCaseForOrdersheet')}
                            >
                                <Text style={styles.btnText}>View Ordersheets</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity style={styles.actionBtn}>
                                    <Text style={styles.btnText}>Download Transcript</Text>
                                </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.govFooter}>
                <Text style={styles.text}>
                    © 2025 Government of Punjab, Pakistan | Department of Social Justice
                </Text>

                {/* <View style={styles.footerLinks}>
                    <TouchableOpacity onPress={() => Linking.openURL('#')}>
                        <Text style={styles.link}>Privacy Policy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Linking.openURL('#')}>
                        <Text style={styles.link}>Terms of Service</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Linking.openURL('#')}>
                        <Text style={styles.link}>Contact Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Linking.openURL('#')}>
                        <Text style={styles.link}>System Help</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </ScrollView>
    );
};

export default Homepage;

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    Header: {
        height: '25%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#28a745",
    },
    logo: {
        width: 80,
        height: 80,
        marginTop: 5,
    },
    title: {
        fontSize: 24,
        color: "#fff",
        fontFamily: "Arial",
        fontWeight: 'bold',
        padding: 5,
    },
    subTitle: {
        fontSize: 14,
        color: "#fff",
        fontFamily: "Arial",
    },
    cardTitle: {
        fontSize: 18,
        color: "black",
        fontWeight: 'bold',
        fontFamily: "Arial",
        padding: 5,
    },
    content: {
        alignItems: "center",
        marginTop: 40,
    },
    card: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 5,
        alignItems: "center",
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        color: "black",
        marginBottom: 10,
    },
    detail: {
        fontSize: 14,
        color: "#797979ff",
        marginBottom: 5,
    },
    time: {
        fontWeight: 'bold',
        color: '#28a745',
    },
    logoutButton: {
        backgroundColor: "#28a745",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 15,
    },
    logoutText: {
        color: "#fff",
        fontWeight: "bold",
    },
    card2: {
        width: '95%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 50,
    },
    transcriptions: {
        borderTopWidth: 4,
        borderTopColor: '#28a745',
    },
    cardHeader: {
        marginBottom: 10,
    },
    cardBody: {
        marginTop: 10,
    },
    actionButtons: {
        flexDirection: 'column',
        gap: 10,
    },
    actionBtn: {
        backgroundColor: '#f9fff8ff',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#28a745',
    },
    primaryBtn: {
        backgroundColor: '#28a745',
    },
    btnText: {
        color: '#28a745',
        fontWeight: '600',
    },
    govFooter: {
        backgroundColor: '#2c3e50',
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 5,
    },
    footerLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
    },
    link: {
        color: '#fff',
        marginHorizontal: 10,
        textDecorationLine: 'underline',
        fontSize: 14,
    },
});
