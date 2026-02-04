"use client";
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { resume } from '../data/resume';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Times-Roman', backgroundColor: '#fff' },
  header: { borderBottomWidth: 2, borderBottomColor: '#000', paddingBottom: 10, marginBottom: 15, textAlign: 'center' },
  name: { fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase' },
  subHeader: { fontSize: 9, marginTop: 4 },
  title: { fontSize: 11, fontWeight: 'bold', marginTop: 8, textTransform: 'uppercase', backgroundColor: '#f4f4f4', padding: 4 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#333', marginTop: 15, marginBottom: 8 },
  text: { fontSize: 10, lineHeight: 1.4 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  company: { fontSize: 10, fontWeight: 'bold' },
  role: { fontSize: 10, fontStyle: 'italic', marginBottom: 2 },
  bullet: { fontSize: 10, marginLeft: 12, marginBottom: 3, paddingRight: 20 }
});

export const ResumePDF = () => (
  <Document author={resume.header.name} title={`${resume.header.name} Resume`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{resume.header.name}</Text>
        <Text style={styles.subHeader}>
          {resume.header.location} | {resume.header.phone} | {resume.header.email}
        </Text>
        <Text style={styles.title}>{resume.header.title}</Text>
      </View>

      <Text style={styles.sectionTitle}>Professional Summary</Text>
      <Text style={styles.text}>{resume.summary}</Text>

      <Text style={styles.sectionTitle}>Technical Skills</Text>
      {Object.entries(resume.skills).map(([category, list]) => (
        <Text key={category} style={styles.text}>
          <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{category}: </Text>
          {list.join(", ")}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Experience</Text>
      {resume.experience.map((exp, i) => (
        <View key={i} wrap={false}>
          <View style={styles.expHeader}>
            <Text style={styles.company}>{exp.company}</Text>
            <Text style={styles.text}>{exp.start} — {exp.end}</Text>
          </View>
          <Text style={styles.role}>{exp.role}</Text>
          {/* Using the .ats key for the PDF bullet points */}
          {exp.highlights.map((h, j) => (
            <Text key={j} style={styles.bullet}>• {h.ats}</Text>
          ))}
        </View>
      ))}

      <Text style={styles.sectionTitle}>Education</Text>
      <View style={styles.expHeader}>
        <Text style={styles.company}>{resume.education[0].institute}</Text>
        <Text style={styles.text}>{resume.education[0].period}</Text>
      </View>
      <Text style={styles.text}>{resume.education[0].degree}</Text>
      <Text style={[styles.text, { fontSize: 9, color: '#444' }]}>
        {resume.education[0].details.join(" | ")}
      </Text>
    </Page>
  </Document>
);