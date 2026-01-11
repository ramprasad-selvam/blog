import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { resume } from './resume';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Times-Roman', backgroundColor: '#fff' },
  header: { borderBottomWidth: 2, borderBottomColor: '#000', pb: 10, mb: 20, textAlign: 'center' },
  name: { fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase' },
  subHeader: { fontSize: 10, marginTop: 4 },
  title: { fontSize: 12, fontWeight: 'bold', marginTop: 8, textTransform: 'uppercase', backgroundColor: '#f0f0f0', padding: 4 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#ccc', mt: 15, mb: 8 },
  text: { fontSize: 10, lineHeight: 1.5, textAlign: 'justify' },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  company: { fontSize: 11, fontWeight: 'bold' },
  role: { fontSize: 10, fontStyle: 'italic', marginBottom: 4 },
  bullet: { fontSize: 10, marginLeft: 15, marginBottom: 2 }
});

export const ResumePDF = () => (
  <Document author={resume.header.name} title={`${resume.header.name} Resume`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{resume.header.name}</Text>
        <Text style={styles.subHeader}>{resume.header.location} | {resume.header.phone} | {resume.header.email}</Text>
        <Text style={styles.title}>{resume.header.title}</Text>
      </View>

      <Text style={styles.sectionTitle}>Professional Summary</Text>
      <Text style={styles.text}>{resume.summary}</Text>

      <Text style={styles.sectionTitle}>Technical Proficiencies</Text>
      {Object.entries(resume.skills).map(([category, list]) => (
        <Text key={category} style={styles.text}>
          <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{category}: </Text>
          {list.join(", ")}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Professional Experience</Text>
      {resume.experience.map((exp, i) => (
        <View key={i} wrap={false}>
          <View style={styles.expHeader}>
            <Text style={styles.company}>{exp.company}</Text>
            <Text style={styles.text}>{exp.period}</Text>
          </View>
          <Text style={styles.role}>{exp.role}</Text>
          {exp.points.map((pt, j) => (
            <Text key={j} style={styles.bullet}>• {pt}</Text>
          ))}
        </View>
      ))}

      {resume.additionalSections.map((sec, i) => (
        <View key={i} wrap={false}>
          <Text style={styles.sectionTitle}>{sec.title}</Text>
          {sec.items.map((item, k) => (
            <View key={k}>
               <View style={styles.expHeader}>
                <Text style={styles.company}>{item.heading}</Text>
                <Text style={styles.text}>{item.subHeading.split('|').pop()}</Text>
              </View>
              <Text style={styles.text}>{item.description}</Text>
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);