import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, StyleSheet, Image } from 'react-native';
import logo from './automated-trial-log-logo-v5.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await fetch("http://10.134.204.206:3000/login-mobile", {
                // replace 192.168.0.105 with your computer’s IP address
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log(data);

            if (data.success && data.user) {
                const loggedInUser = {
                    name: data.user.judge_name,
                    id: data.user.judge_code,
                    email: data.user.judge_email,
                    role: "judge",
                };

                await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));
                // alert(`✅ Welcome, ${loggedInUser.name}!`);

                router.push("/Homepage");
            } else {
                alert("Invalid credentials");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Unable to connect to the server");
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.Header}>
                <Image
                    source={logo}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Automated Trial Log</Text>
                <Text style={styles.subTitle}>Department of Social Justice | Government of Punjab</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.LoginTitle}>Login</Text>

                    <TextInput
                        style={[
                            styles.input,
                            { borderColor: isEmailFocused ? '#28a745' : '#ccc' }
                        ]}
                        placeholder="Email"
                        placeholderTextColor="#aaa"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                    />

                    <TextInput
                        style={[
                            styles.input,
                            { borderColor: isPasswordFocused ? '#28a745' : '#ccc' }
                        ]}
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                    />

                    <TouchableOpacity onPress={() => Linking.openURL('#')} style={styles.passLinkContainer}>
                        <Text style={styles.PassLink}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
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
        </View>
    );
};

export default LogIn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    Header: {
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#28a745'
    },
    logo: {
        width: 80,
        height: 80,
        marginTop: 5,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        padding: 5
    },
    subTitle: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'Arial',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#28a745'
        // marginTop: 50,
    },
    LoginTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e7e34',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#28a745',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    PassLink: {
        marginBottom: 15,
        marginLeft: 146,
        color: '#1e7e34',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
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
