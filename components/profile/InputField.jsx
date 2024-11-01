import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  onUpdate,
  icon,
  optional = false,
  loading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleUpdate = () => {
    onUpdate();
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{
        fontSize: 16,
        color: '#374151',
        marginBottom: 8,
        fontWeight: '500'
      }}>
        {label} {optional && <Text style={{ color: '#6B7280', fontSize: 14 }}>(Optional)</Text>}
      </Text>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
      }}>
        <Ionicons name={icon} size={20} color="#6B7280" style={{ marginRight: 8 }} />
        
        {isEditing ? (
          <TextInput
            value={tempValue}
            onChangeText={(text) => {
              setTempValue(text);
              onChangeText(text);
            }}
            placeholder={placeholder}
            keyboardType={keyboardType}
            style={{
              flex: 1,
              paddingVertical: 12,
              fontSize: 16,
              color: '#1F2937',
            }}
            editable={!loading}
          />
        ) : (
          <Text style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 16,
            color: value ? '#1F2937' : '#9CA3AF',
          }}>
            {value || placeholder}
          </Text>
        )}

        {isEditing ? (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={handleCancel}
              disabled={loading}
              style={{
                backgroundColor: '#EF4444',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="close" size={16} color="white" style={{ marginRight: 4 }} />
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleUpdate}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#E5E7EB' : '#028758',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#6B7280" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={16} color="white" style={{ marginRight: 4 }} />
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Save</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleEdit}
            style={{
              backgroundColor: '#028758',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons name="pencil" size={16} color="white" style={{ marginRight: 4 }} />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputField;