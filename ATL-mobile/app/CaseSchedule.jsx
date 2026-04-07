import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import logo from './automated-trial-log-logo-v5.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

export default function JudgeViewCases() {
    const [cases, setCases] = useState([]);
    const [search, setSearch] = useState("");
    const [caseType, setCaseType] = useState("");
    const [status, setStatus] = useState("");
    const [caseTypes, setCaseTypes] = useState([]);

    useEffect(() => {
        const loadCases = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                const user = storedUser ? JSON.parse(storedUser) : null;

                if (!user) {
                    console.error(" No user found in AsyncStorage");
                    return;
                }

                const res = await fetch("http://10.134.204.206:3000/jcases", {
                    headers: { "x-judge-code": user.id },
                });
                // console.log("Fetch status:", res.status);
                const data = await res.json();
                // console.log("Cases fetched:", data);
                setCases(data); // assuming API returns array of cases

            } catch (err) {
                console.error(" Error loading cases:", err);
            }
        };

        loadCases();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("http://192.168.100.4:3000/case-types");
                const data = await res.json();
                setCaseTypes(data);
            } catch (err) {
                console.error("Error fetching case types:", err);
            }
        }
        fetchData();
    }, []);

    const filteredCases = cases.filter((c) => {
        const caseNumber =
            typeof c.caseNumber === "number"
                ? c.caseNumber.toString().toLowerCase()
                : (c.caseNumber || "").toString().toLowerCase();
        const parties = `${c.party1 || ""} ${c.party2 || ""}`.toLowerCase();
        const title = typeof c.caseTitle === "string" ? c.caseTitle.toLowerCase() : "";
        const caseTypeVal = typeof c.caseType === "string" ? c.caseType.toLowerCase() : "";
        const statusVal = typeof c.status === "string" ? c.status.toLowerCase() : "";

        return (
            (search === "" ||
                caseNumber.includes(search.toLowerCase()) ||
                parties.includes(search.toLowerCase()) ||
                title.includes(search.toLowerCase())) &&
            (caseType === "" || caseTypeVal === caseType) &&
            (status === "" || statusVal === status)
        );
    })
    const getCaseColor = (type) => {
        switch ((type || "").toLowerCase()) {
            case "criminal":
                return "#dc3545"; // red
            case "civil":
                return "#28a745"; // green
            case "family":
                return "#ffc107"; // yellow
            case "labor":
                return "#008cff"; // blue
            case "commercial":
                return "#ff8000"; // orange
            default:
                return "#999"; // gray fallback
        }
    }
    const getStatusColor = (type) => {
        switch ((type || "").toLowerCase()) {
            case "scheduled":
                return "#155724";
            case "in-progress":
                return "#856404";
            case "completed":
                return "#0c5460";
            case "postponed":
                return "#721c24";
            default:
                return "#999";
        }
    };


    return (
        <ScrollView style={styles.container}>
            {/* Header */}
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

            {/* Page Header */}
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>Case Schedules</Text>
            </View>

            {/* Filters */}
            <View style={styles.filters}>
                <TextInput
                    style={styles.input}
                    placeholder="Search by case number or party..."
                    value={search}
                    onChangeText={setSearch}
                />

                <View style={styles.filterRow}>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={caseType}
                            onValueChange={(itemValue) => setCaseType(itemValue)}
                        >
                            <Picker.Item label="All Case Types" value="" />
                            {caseTypes.map((ct) => (
                                <Picker.Item
                                    key={ct.id}
                                    label={ct.name}
                                    value={ct.name.toLowerCase()}
                                />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={status}
                            style={styles.select}
                            onValueChange={(itemValue) => setStatus(itemValue)}
                        >
                            <Picker.Item label="All Status" value="" />
                            <Picker.Item label="Scheduled" value="scheduled" />
                            <Picker.Item label="In Progress" value="in-progress" />
                            <Picker.Item label="Completed" value="completed" />
                            <Picker.Item label="Postponed" value="postponed" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.clearBtnContainer}>
                    <TouchableOpacity
                        style={styles.clearBtn}
                        onPress={() => {
                            setSearch("");
                            setCaseType("");
                            setStatus("");
                        }}
                    >
                        <Text style={styles.clearBtnText}>Clear</Text>
                    </TouchableOpacity>
                </View>
            </View>


            {/* Cases Table */}
            <View style={styles.tableCard}>
                <View style={styles.tableContainer}>
                    <Text style={styles.sectionTitle}>Browse Cases</Text>

                    {filteredCases.length === 0 ? (
                        <Text style={styles.noData}>No cases found.</Text>
                    ) : (
                        filteredCases.map((c, index) => {
                            const caseColor = getCaseColor(c.caseType);
                            const statusColor = getStatusColor(c.status);
                            return (
                                <View key={c.id || `${c.caseNumber}-${index}`}
                                    style={[styles.caseCard, { borderLeftColor: caseColor, borderLeftWidth: 4 },]}
                                >
                                    <Text style={styles.caseNumber}>
                                        Case No: <Text style={styles.bold}>{c.caseNumber}</Text>
                                    </Text>
                                    <Text>
                                        Type: <Text style={{ color: caseColor, fontWeight: '600' }}>{c.caseType}</Text>
                                    </Text>
                                    <Text>Title: {c.caseTitle}</Text>
                                    <Text>
                                        Parties: {c.party1} vs {c.party2}
                                    </Text>
                                    <Text>Stenographer: {c.stenographer}</Text>
                                    <Text>
                                        Date & Time:{" "}
                                        {c.hearingDate
                                            ? `${c.hearingDate} ${c.hearingTime}`
                                            : "Not Scheduled"}
                                    </Text>
                                    <Text>
                                        Status:{" "}
                                        <Text style={{ fontWeight: "bold", color: statusColor }}>{c.status.toUpperCase()}</Text>
                                    </Text>
                                </View>
                            );
                        })
                    )}
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    © 2025 Government of Punjab, Pakistan | Department of Social Justice
                </Text>
                {/* 
                <View style={styles.footerLinks}>
                    <Text style={styles.footerLink}>Privacy Policy</Text>
                    <Text style={styles.footerLink}>Terms of Service</Text>
                    <Text style={styles.footerLink}>Contact Support</Text>
                    <Text style={styles.footerLink}>System Help</Text>
                </View> */}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    Header: {
        height: 200,
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
        fontWeight: 'bold',
        fontFamily: "Arial",
        padding: 5,
    },
    subTitle: {
        fontSize: 14,
        color: "#fff",
        fontFamily: "Arial",
    },
    link: { color: "#28a745", fontWeight: "bold" },
    pageHeader: {
        alignItems: "center",
        marginTop: 20,
    },
    pageTitle: { fontSize: 18, fontWeight: "bold", color: "#40723bff" },
    filters: {
        backgroundColor: "#f8fff7ff",
        borderRadius: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginVertical: 10,
    },
    filterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        gap: 10,
    },
    pickerContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        overflow: "hidden",
    },
    clearBtnContainer: {
        alignItems: "center",
    },
    clearBtn: {
        backgroundColor: "#5b5b5bff",
        borderRadius: 5,
        paddingVertical: 6,
        paddingHorizontal: 16,
        alignSelf: "center",
        elevation: 2,
    },
    clearBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
    },
    select: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        marginBottom: 10,
    },
    tableCard: {
        flex: 1,
        alignItems: 'center',
    },
    tableContainer: {
        width: '95%',
        borderRadius: 12,
        marginVertical: 10,
        borderTopWidth: 4,
        borderTopColor: '#28a745',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        marginVertical: 10,
        textAlign: 'center',
    },
    noData: {
        textAlign: "center",
        color: "#999",
        padding: 20,
    },
    caseCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    caseNumber: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
    bold: { fontWeight: "bold" },
    footer: {
        backgroundColor: "#2c3e50",
        paddingVertical: 20,
        marginTop: 30,
        alignItems: "center",
    },
    footerText: {
        color: "#fff",
        fontSize: 13,
        textAlign: "center",
        marginBottom: 5,
    },
    footerLinks: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 10,
    },
    footerLink: {
        color: "#fff",
        textDecorationLine: "underline",
        marginHorizontal: 8,
        fontSize: 13,
    },
});
