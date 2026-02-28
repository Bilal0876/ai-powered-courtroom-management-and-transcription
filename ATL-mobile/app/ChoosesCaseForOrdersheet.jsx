import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import logo from './automated-trial-log-logo-v5.png';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";

export default function JudgeDownloadCases() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const loadCases = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user) {
          console.error("❌ No user found in AsyncStorage");
          setCases([]);
          return;
        }

        const res = await fetch("http://10.134.204.206:3000/completed-cases", {
          headers: { "x-judge-code": user.id },
        });

        const data = await res.json();
        console.log("Fetched cases:", data);

        if (data && Array.isArray(data.data)) {
          setCases(data.data);
        } else {
          console.warn("❌ Unexpected API response, setting cases to empty array");
          setCases([]);
        }
      } catch (err) {
        console.error("❌ Error loading cases:", err);
        setCases([]);
      }
    };

    loadCases();
  }, []);

  const getCaseColor = (type) => {
    switch ((type || "").toLowerCase()) {
      case "criminal":
        return "#dc3545";
      case "civil":
        return "#28a745";
      case "family":
        return "#ffc107";
      case "labor":
        return "#008cff";
      case "commercial":
        return "#ff8000";
      default:
        return "#999";
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
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

  // ✅ Open PDF or audio URL in browser
  const openFile = async (url) => {
    if (!url) {
      Alert.alert("File not available");
      return;
    }

    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (err) {
      console.error("Open file error:", err);
      Alert.alert("❌ Failed to open file");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: "space-between" }}>

        {/* Main content */}
        <View style={{ alignItems: "center" }}>
          {/* Header */}
          <View style={styles.Header}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Automated Trial Log</Text>
            <Text style={styles.subTitle}>
              Department of Social Justice | Government of Punjab
            </Text>
          </View>

          {/* Page title */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Download Case Details</Text>
          </View>

          {/* Case List */}
          <View style={styles.tableCard}>
            {cases.length > 0 ? (
              cases.map((c, index) => {
                const caseColor = getCaseColor(c.case_type);
                const statusColor = getStatusColor(c.status);

                return (
                  <View
                    key={c.case_id || index}
                    style={[styles.caseCard, { borderLeftColor: caseColor }]}
                  >
                    <Text style={styles.caseNumber}>
                      Case No: <Text style={styles.bold}>{c.case_id}</Text>
                    </Text>
                    <Text>
                      Type:{" "}
                      <Text style={{ color: caseColor, fontWeight: "600" }}>
                        {c.case_type}
                      </Text>
                    </Text>
                    <Text>Title: {c.case_title}</Text>
                    <Text>
                      Parties: {c.case_party1} vs {c.case_party2}
                    </Text>
                    <Text>
                      Status:{" "}
                      <Text style={{ color: statusColor, fontWeight: "bold" }}>
                        {c.status || "completed"}
                      </Text>
                    </Text>

                    {/* Open buttons */}
                    <View style={styles.downloadBtns}>
                      <TouchableOpacity
                        style={styles.downloadBtn}
                        onPress={() => openFile(c.ordersheet_url)}
                      >
                        <Text style={styles.downloadText}>Open Ordersheet</Text>
                      </TouchableOpacity>

                      {/* <TouchableOpacity
                        style={styles.downloadBtn}
                        onPress={() => openFile(c.transcript_url)}
                      >
                        <Text style={styles.downloadText}>Open Transcript</Text>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noData}>No cases found.</Text>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Government of Punjab, Pakistan | Department of Social Justice
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: "#f5f5f5" },
  Header: {
    width: '100%',
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
  title: { fontSize: 24, fontWeight: 'bold', color: "#fff", padding: 5 },
  subTitle: { fontSize: 14, color: "#fff" },
  pageHeader: { alignItems: "center", marginVertical: 15 },
  pageTitle: { fontSize: 18, fontWeight: "bold", color: "#40723bff" },
  tableCard: { flex: 1, alignItems: "center", width: "95%", marginBottom: 20 },
  caseCard: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  caseNumber: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  bold: { fontWeight: "bold" },
  noData: { textAlign: "center", color: "#999", padding: 20 },
  downloadBtns: { marginTop: 10 },
  downloadBtn: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 6,
    marginVertical: 3,
  },
  downloadText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  footer: {
    backgroundColor: "#2c3e50",
    paddingVertical: 20,
    marginTop: 20,
    alignItems: "center",
  },
  footerText: { color: "#fff", fontSize: 13, textAlign: "center" },
});
