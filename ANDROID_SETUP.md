# 📱 SETUP ANDROID APK - MASTERPIECE

## 🚀 **Generar APK desde cero**

### **📋 Prerrequisitos:**
- Node.js 20+ (usar `nvm use 22`)
- Android Studio instalado
- Java configurado (viene con Android Studio)

### **⚡ Setup rápido:**

```bash
# 1. Instalar dependencias
npm install

# 2. Instalar Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/splash-screen

# 3. Inicializar Capacitor
npx cap init "Masterpiece" "com.masterpiece.app"

# 4. Agregar plataforma Android
npx cap add android

# 5. Build del proyecto web
npm run build

# 6. Sincronizar con Android
npx cap sync android

# 7. Abrir en Android Studio
npx cap open android
```

### **🎨 Personalización incluida:**
- ✅ **Icono:** Fondo negro + estrella dorada
- ✅ **Splash Screen:** Imagen vintage personalizada  
- ✅ **PWA Manifest:** Configurado para instalación
- ✅ **Capacitor Plugins:** SplashScreen configurado

### **📱 Generar APK:**

1. **En Android Studio:**
   - Build → Clean Project
   - Build → Rebuild Project  
   - Build → Build Bundle(s) / APK(s) → Build APK(s)

2. **APK se genera en:**
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### **🔧 Si hay problemas:**
- File → Invalidate Caches and Restart
- File → Sync Project with Gradle Files
- Verificar que JAVA_HOME esté configurado

### **📊 Resultado:**
- **APK Size:** ~15-20MB
- **Compatibilidad:** Android 7.0+ (API 24+)
- **Funcionalidades:** App web completa + capacidades nativas

---

**Nota:** La carpeta `/android` se genera automáticamente y no se incluye en el repo para evitar conflictos.
