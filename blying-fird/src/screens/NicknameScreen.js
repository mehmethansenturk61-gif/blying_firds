import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Backdrop, Button, Panel, Logo } from '../components/UI';
import { BirdIcon } from '../components/Birds';
import { TOP_INSET, NICK_MIN, NICK_MAX } from '../constants/config';

export default function NicknameScreen({ profile, editing, onSave, onCancel }) {
  const [nick, setNick] = useState(editing ? profile.nickname : '');
  const [error, setError] = useState('');

  const submit = () => {
    const n = nick.trim();
    if (n.length < NICK_MIN || n.length > NICK_MAX) {
      setError(`Takma ad en az ${NICK_MIN}, en fazla ${NICK_MAX} karakter olmalı.`);
      return;
    }
    onSave(n);
  };

  return (
    <View style={styles.root}>
      <Backdrop themeId={profile.background} />
      <View style={[styles.content, { paddingTop: TOP_INSET + 20 }]}>
        <Logo />
        <BirdIcon type={profile.character} size={100} />
        <Panel style={{ marginTop: 16 }}>
          <Text style={styles.title}>{editing ? 'Takma Adını Değiştir' : 'Hoş geldin! Takma adın ne?'}</Text>
          <TextInput
            value={nick}
            onChangeText={(t) => { setNick(t); setError(''); }}
            maxLength={NICK_MAX}
            placeholder="Takma adın"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={submit}
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title={editing ? 'Kaydet' : 'Başla'} color="green" onPress={submit} style={{ marginTop: 12 }} />
          {editing ? <Button title="Vazgeç" color="gray" small onPress={onCancel} style={{ marginBottom: 0 }} /> : null}
        </Panel>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24 },
  title: { fontSize: 20, fontWeight: '800', color: '#3b2a5a', marginBottom: 12, textAlign: 'center' },
  input: { width: '100%', borderWidth: 3, borderColor: '#9b59b6', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16, fontSize: 22, fontWeight: '700', color: '#222', backgroundColor: '#fff', textAlign: 'center' },
  error: { color: '#c0392b', fontWeight: '700', marginTop: 8, textAlign: 'center' },
});
