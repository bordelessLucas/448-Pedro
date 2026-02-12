import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../lib/firestore';
import { storage } from '../lib/storage';

export interface InspectionReport {
  id?: string;
  userId: string;
  inspectionDate: string;
  millSupplier: string;
  orderNumber: string;
  piles: string;
  pineType: 'pine100' | 'combiPine' | 'combiEuca';
  location: string;
  itemInspected: string;
  dimensionalEval: 'approved' | 'rejected' | 'rework';
  visualEval: 'approved' | 'rejected' | 'rework';
  packagingEval: 'approved' | 'rejected' | 'rework';
  lotTreatment: 'approved' | 'rejected' | 'rework';
  defects: Array<{ name: string; description: string; qty: string }>;
  dimensionalRecords: {
    length: string[];
    lengthUnit: string;
    width: string[];
    widthUnit: string;
    thickness: string[];
    thicknessUnit: string;
    squareness: string[];
    squarenessUnit: string;
  };
  images: {
    length: string[];
    width: string[];
    thickness: string[];
    square: string[];
    face: string[];
    backFace: string[];
    palette: string[];
    paint: string[];
    constructionDefect: string[];
    stamp: string[];
    edge: string[];
    height: string[];
  };
  status: 'approved' | 'rejected' | 'pending';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const REPORTS_COLLECTION = 'inspectionReports';

// Upload de imagem para o Storage
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${file.name}`);
  }
};

// Upload de múltiplas imagens com tratamento de erros
export const uploadImages = async (
  files: File[],
  reportId: string,
  category: string
): Promise<string[]> => {
  const uploadPromises = files.map(async (file, index) => {
    try {
      // Usar timestamp único para cada arquivo
      const timestamp = Date.now() + index;
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const path = `reports/${reportId}/${category}/${timestamp}_${sanitizedFileName}`;
      return await uploadImage(file, path);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      // Retornar string vazia em caso de erro para não quebrar o fluxo
      return '';
    }
  });
  
  const results = await Promise.all(uploadPromises);
  // Filtrar URLs vazias (uploads que falharam)
  return results.filter(url => url !== '');
};

// Criar novo relatório
export const createReport = async (
  reportData: Omit<InspectionReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
    ...reportData,
    status: 'pending',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  return docRef.id;
};

// Buscar todos os relatórios do usuário
export const getUserReports = async (userId: string): Promise<InspectionReport[]> => {
  try {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reports: InspectionReport[] = [];
    
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      } as InspectionReport);
    });
    
    return reports;
  } catch (error: any) {
    // Se o erro for de índice faltando, buscar sem ordenação
    if (error.code === 'failed-precondition' || error.message?.includes('index')) {
      console.warn('Index not found, fetching without orderBy...');
      const q = query(
        collection(db, REPORTS_COLLECTION),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const reports: InspectionReport[] = [];
      
      querySnapshot.forEach((doc) => {
        reports.push({
          id: doc.id,
          ...doc.data()
        } as InspectionReport);
      });
      
      // Ordenar manualmente no cliente
      return reports.sort((a, b) => {
        const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return dateB - dateA;
      });
    }
    
    throw error;
  }
};

// Buscar relatório por ID
export const getReportById = async (reportId: string): Promise<InspectionReport | null> => {
  const docRef = doc(db, REPORTS_COLLECTION, reportId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as InspectionReport;
  }
  
  return null;
};

// Atualizar relatório
export const updateReport = async (
  reportId: string,
  data: Partial<InspectionReport>
): Promise<void> => {
  const docRef = doc(db, REPORTS_COLLECTION, reportId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

// Deletar relatório
export const deleteReport = async (reportId: string): Promise<void> => {
  const docRef = doc(db, REPORTS_COLLECTION, reportId);
  await deleteDoc(docRef);
};

// Determinar status geral do relatório baseado nas avaliações
export const determineReportStatus = (
  dimensionalEval: string,
  visualEval: string,
  packagingEval: string,
  lotTreatment: string
): 'approved' | 'rejected' | 'pending' => {
  const evals = [dimensionalEval, visualEval, packagingEval, lotTreatment];
  
  if (evals.some(e => e === 'rejected')) {
    return 'rejected';
  }
  
  if (evals.some(e => e === 'rework')) {
    return 'pending';
  }
  
  return 'approved';
};
