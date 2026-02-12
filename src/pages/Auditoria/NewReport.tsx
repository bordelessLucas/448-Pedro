import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import Button from '../../components/Button/Button';
import { HiSave, HiX, HiUpload, HiPlus } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { createReport, updateReport, getReportById, uploadImages, determineReportStatus } from '../../services/reportService';
import './NewReport.css';

interface DefectItem {
  name: string;
  description: string;
  qty: string;
}

interface ImageUpload {
  file: File | null;
  preview: string;
}

export default function NewReport() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Basic Information
  const [inspectionDate, setInspectionDate] = useState('');
  const [millSupplier, setMillSupplier] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [piles, setPiles] = useState('');
  const [pineType, setPineType] = useState<'pine100' | 'combiPine' | 'combiEuca'>('pine100');
  const [location, setLocation] = useState('');
  const [itemInspected, setItemInspected] = useState('');

  // Evaluations
  const [dimensionalEval, setDimensionalEval] = useState<'approved' | 'rejected' | 'rework'>('approved');
  const [visualEval, setVisualEval] = useState<'approved' | 'rejected' | 'rework'>('approved');
  const [packagingEval, setPackagingEval] = useState<'approved' | 'rejected' | 'rework'>('approved');
  const [lotTreatment, setLotTreatment] = useState<'approved' | 'rejected' | 'rework'>('approved');

  // Defects
  const [defects, setDefects] = useState<DefectItem[]>([
    { name: 'Wrong thickness', description: '', qty: '' },
    { name: 'Dimensional problem (L or W)', description: '', qty: '' },
    { name: 'Peeling mark', description: '', qty: '' },
    { name: 'Split', description: '', qty: '' },
    { name: 'Knot hole too big', description: '', qty: '' },
    { name: 'Sound knot too big', description: '', qty: '' },
    { name: 'Pressing mark', description: '', qty: '' },
    { name: 'Face rugosity', description: '', qty: '' },
    { name: 'Delamination/poor bonding', description: '', qty: '' },
    { name: 'Damaged edges', description: '', qty: '' },
    { name: 'Vaneer overlap or gap', description: '', qty: '' },
    { name: 'Bluestain', description: '', qty: '' },
    { name: 'Bleed through', description: '', qty: '' },
    { name: 'Warping', description: '', qty: '' },
    { name: 'Pine crust in face or back', description: '', qty: '' },
    { name: 'Stamp transfer or legibility', description: '', qty: '' },
    { name: 'Bad skid dimension', description: '', qty: '' },
    { name: 'Other', description: '', qty: '' }
  ]);

  // Dimensional Records
  const [lengthRecords, setLengthRecords] = useState(['']);
  const [lengthUnit, setLengthUnit] = useState('mm');
  const [widthRecords, setWidthRecords] = useState(['']);
  const [widthUnit, setWidthUnit] = useState('mm');
  const [thicknessRecords, setThicknessRecords] = useState(['']);
  const [thicknessUnit, setThicknessUnit] = useState('mm');
  const [squarenessRecords, setSquarenessRecords] = useState(['']);
  const [squarenessUnit, setSquarenessUnit] = useState('mm');

  // Images
  const [lengthImages, setLengthImages] = useState<ImageUpload[]>([]);
  const [widthImages, setWidthImages] = useState<ImageUpload[]>([]);
  const [thicknessImages, setThicknessImages] = useState<ImageUpload[]>([]);
  const [squareImages, setSquareImages] = useState<ImageUpload[]>([]);
  const [faceImages, setFaceImages] = useState<ImageUpload[]>([]);
  const [backFaceImages, setBackFaceImages] = useState<ImageUpload[]>([]);
  const [paletteImages, setPaletteImages] = useState<ImageUpload[]>([]);
  const [paintImages, setPaintImages] = useState<ImageUpload[]>([]);
  const [constructionDefectImages, setConstructionDefectImages] = useState<ImageUpload[]>([]);
  const [stampImages, setStampImages] = useState<ImageUpload[]>([]);
  const [edgeImages, setEdgeImages] = useState<ImageUpload[]>([]);
  const [heightImages, setHeightImages] = useState<ImageUpload[]>([]);

  const handleDefectChange = (index: number, field: 'description' | 'qty', value: string) => {
    const newDefects = [...defects];
    newDefects[index][field] = value;
    setDefects(newDefects);
  };

  const addDimensionalRecord = (
    records: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter([...records, '']);
  };

  const removeDimensionalRecord = (
    records: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    if (records.length > 1) {
      const newRecords = records.filter((_, i) => i !== index);
      setter(newRecords);
    }
  };

  const updateDimensionalRecord = (
    records: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    const newRecords = [...records];
    newRecords[index] = value;
    setter(newRecords);
  };

  const handleImageUpload = (
    setter: React.Dispatch<React.SetStateAction<ImageUpload[]>>,
    currentImages: ImageUpload[]
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const newImages: ImageUpload[] = Array.from(files).map(file => ({
          file,
          preview: URL.createObjectURL(file)
        }));
        setter([...currentImages, ...newImages]);
      }
    };
  };

  const handleRemoveImage = (
    setter: React.Dispatch<React.SetStateAction<ImageUpload[]>>,
    currentImages: ImageUpload[],
    index: number
  ) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    setter(newImages);
  };

  // Carregar dados do relatório quando estiver editando
  useEffect(() => {
    const loadReportData = async () => {
      if (!isEditMode || !id) return;
      
      setLoadingData(true);
      try {
        const report = await getReportById(id);
        
        if (!report) {
          setError('Relatório não encontrado');
          navigate('/auditoria');
          return;
        }

        // Verificar se o usuário é o dono do relatório
        if (currentUser && report.userId !== currentUser.uid) {
          setError('Você não tem permissão para editar este relatório');
          navigate('/auditoria');
          return;
        }

        // Preencher campos básicos
        setInspectionDate(report.inspectionDate);
        setMillSupplier(report.millSupplier);
        setOrderNumber(report.orderNumber);
        setPiles(report.piles);
        setPineType(report.pineType);
        setLocation(report.location);
        setItemInspected(report.itemInspected);

        // Preencher avaliações
        setDimensionalEval(report.dimensionalEval);
        setVisualEval(report.visualEval);
        setPackagingEval(report.packagingEval);
        setLotTreatment(report.lotTreatment);

        // Preencher defeitos
        setDefects(report.defects);

        // Preencher registros dimensionais
        setLengthRecords(report.dimensionalRecords.length || ['']);
        setLengthUnit(report.dimensionalRecords.lengthUnit || 'mm');
        setWidthRecords(report.dimensionalRecords.width || ['']);
        setWidthUnit(report.dimensionalRecords.widthUnit || 'mm');
        setThicknessRecords(report.dimensionalRecords.thickness || ['']);
        setThicknessUnit(report.dimensionalRecords.thicknessUnit || 'mm');
        setSquarenessRecords(report.dimensionalRecords.squareness || ['']);
        setSquarenessUnit(report.dimensionalRecords.squarenessUnit || 'mm');

        // Preencher imagens existentes (apenas URLs, não arquivos)
        if (report.images) {
          const createImageFromUrl = (urls: string[]): ImageUpload[] => {
            return urls.map(url => ({ file: null, preview: url }));
          };

          setLengthImages(createImageFromUrl(report.images.length || []));
          setWidthImages(createImageFromUrl(report.images.width || []));
          setThicknessImages(createImageFromUrl(report.images.thickness || []));
          setSquareImages(createImageFromUrl(report.images.square || []));
          setFaceImages(createImageFromUrl(report.images.face || []));
          setBackFaceImages(createImageFromUrl(report.images.backFace || []));
          setPaletteImages(createImageFromUrl(report.images.palette || []));
          setPaintImages(createImageFromUrl(report.images.paint || []));
          setConstructionDefectImages(createImageFromUrl(report.images.constructionDefect || []));
          setStampImages(createImageFromUrl(report.images.stamp || []));
          setEdgeImages(createImageFromUrl(report.images.edge || []));
          setHeightImages(createImageFromUrl(report.images.height || []));
        }
      } catch (error) {
        console.error('Error loading report:', error);
        setError('Erro ao carregar relatório');
      } finally {
        setLoadingData(false);
      }
    };

    loadReportData();
  }, [id, isEditMode, currentUser, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a report');
      return;
    }

    console.log('Current user:', currentUser.uid);
    console.log('User email:', currentUser.email);

    setLoading(true);
    setError('');

    try {
      let reportId = id;

      if (!isEditMode) {
        // Criar novo relatório
        reportId = await createReport({
        userId: currentUser.uid,
        inspectionDate,
        millSupplier,
        orderNumber,
        piles,
        pineType,
        location,
        itemInspected,
        dimensionalEval,
        visualEval,
        packagingEval,
        lotTreatment,
        defects,
        dimensionalRecords: {
          length: lengthRecords,
          lengthUnit,
          width: widthRecords,
          widthUnit,
          thickness: thicknessRecords,
          thicknessUnit,
          squareness: squarenessRecords,
          squarenessUnit
        },
        images: {
          length: [],
          width: [],
          thickness: [],
          square: [],
          face: [],
          backFace: [],
          palette: [],
          paint: [],
          constructionDefect: [],
          stamp: [],
          edge: [],
          height: []
        }
        });
        console.log('Report created with ID:', reportId);
      } else {
        // Atualizar relatório existente
        if (!reportId) {
          throw new Error('ID do relatório não encontrado');
        }
        console.log('Updating report with ID:', reportId);
      }

      // Upload de todas as imagens
      const imageCategories = [
        { images: lengthImages, category: 'length', name: 'Length' },
        { images: widthImages, category: 'width', name: 'Width' },
        { images: thicknessImages, category: 'thickness', name: 'Thickness' },
        { images: squareImages, category: 'square', name: 'Square' },
        { images: faceImages, category: 'face', name: 'Face' },
        { images: backFaceImages, category: 'backFace', name: 'Back Face' },
        { images: paletteImages, category: 'palette', name: 'Palette' },
        { images: paintImages, category: 'paint', name: 'Paint' },
        { images: constructionDefectImages, category: 'constructionDefect', name: 'Construction Defect' },
        { images: stampImages, category: 'stamp', name: 'Stamp' },
        { images: edgeImages, category: 'edge', name: 'Edge' },
        { images: heightImages, category: 'height', name: 'Height' }
      ];

      const uploadedImages: any = {};
      const failedCategories: string[] = [];

      // Upload de imagens com tratamento de erros individual
      for (const { images, category, name } of imageCategories) {
        if (images.length > 0) {
          try {
            const files = images.map(img => img.file).filter(f => f !== null) as File[];
            console.log(`Uploading ${files.length} images for ${name}...`);
            const urls = await uploadImages(files, reportId, category);
            uploadedImages[category] = urls;
            
            // Se algumas imagens falharam
            if (urls.length < files.length) {
              failedCategories.push(`${name} (${urls.length}/${files.length} uploaded)`);
            }
          } catch (error) {
            console.error(`Error uploading ${name} images:`, error);
            uploadedImages[category] = [];
            failedCategories.push(name);
          }
        } else {
          uploadedImages[category] = [];
        }
      }

      // Atualizar o relatório com as URLs das imagens e status final
      const status = determineReportStatus(dimensionalEval, visualEval, packagingEval, lotTreatment);
      
      if (isEditMode) {
        // Atualizar relatório existente
        await updateReport(reportId, {
          inspectionDate,
          millSupplier,
          orderNumber,
          piles,
          pineType,
          location,
          itemInspected,
          dimensionalEval,
          visualEval,
          packagingEval,
          lotTreatment,
          defects,
          dimensionalRecords: {
            length: lengthRecords,
            lengthUnit,
            width: widthRecords,
            widthUnit,
            thickness: thicknessRecords,
            thicknessUnit,
            squareness: squarenessRecords,
            squarenessUnit
          },
          images: uploadedImages,
          status
        });
      } else {
        // Atualizar apenas imagens e status do novo relatório
        await updateReport(reportId, {
          images: uploadedImages,
          status
        });
      }

      // Mostrar aviso se houver falhas no upload
      if (failedCategories.length > 0) {
        console.warn('Some images failed to upload:', failedCategories);
        alert(
          `Report saved successfully!\n\nWarning: Some images failed to upload:\n${failedCategories.join(', ')}\n\nYou can edit the report later to add the missing images.`
        );
      }

      navigate('/auditoria');
    } catch (err: any) {
      console.error('Error saving report:', err);
      setError(err.message || 'Failed to save report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderImageUploadSection = (
    title: string,
    images: ImageUpload[],
    setter: React.Dispatch<React.SetStateAction<ImageUpload[]>>,
    maxImages: number
  ) => (
    <div className="image-upload-section">
      <h4>{title}</h4>
      <div className="image-upload-grid">
        {images.map((img, index) => (
          <div key={index} className="image-preview">
            <img src={img.preview} alt={`Preview ${index + 1}`} />
            <button
              type="button"
              className="image-remove"
              onClick={() => handleRemoveImage(setter, images, index)}
            >
              <HiX />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="image-upload-button">
            <HiUpload />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload(setter, images)}
              style={{ display: 'none' }}
            />
          </label>
        )}
      </div>
      <p className="image-count">{images.length} of {maxImages} images uploaded</p>
    </div>
  );

  return (
    <div className="new-report-layout">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="new-report-layout__content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="new-report">
          {loadingData ? (
            <div className="report-form__loading">
              <p>Carregando relatório...</p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="report-form">
            <div className="report-form__header">
              <div>
                <h1 className="report-form__title">
                  {isEditMode ? 'Edit Inspection Report' : 'New Inspection Report'}
                </h1>
                <p className="report-form__subtitle">
                  {isEditMode ? 'Update the inspection report information' : 'Fill in all required information'}
                </p>
                {error && <p className="report-form__error">{error}</p>}
              </div>
              <div className="report-form__actions">
                <Button
                  type="button"
                  variant="outline"
                  size="medium"
                  onClick={() => navigate('/auditoria')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  icon={<HiSave />}
                  iconPosition="left"
                  loading={loading}
                >
                  Save Report
                </Button>
              </div>
            </div>

            {/* Basic Information */}
            <section className="form-section">
              <h2 className="form-section__title">Basic Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Inspection Date*</label>
                  <input
                    type="date"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mill/Supplier*</label>
                  <input
                    type="text"
                    value={millSupplier}
                    onChange={(e) => setMillSupplier(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Order Number*</label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Piles</label>
                  <input
                    type="text"
                    value={piles}
                    onChange={(e) => setPiles(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Pine Type*</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="pineType"
                        value="pine100"
                        checked={pineType === 'pine100'}
                        onChange={(e) => setPineType(e.target.value as any)}
                      />
                      <span>Pine 100%</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="pineType"
                        value="combiPine"
                        checked={pineType === 'combiPine'}
                        onChange={(e) => setPineType(e.target.value as any)}
                      />
                      <span>Combi Pine</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="pineType"
                        value="combiEuca"
                        checked={pineType === 'combiEuca'}
                        onChange={(e) => setPineType(e.target.value as any)}
                      />
                      <span>Combi Euca</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Inspection Location*</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group form-group--full">
                  <label>Item Inspected*</label>
                  <input
                    type="text"
                    value={itemInspected}
                    onChange={(e) => setItemInspected(e.target.value)}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Evaluations */}
            <section className="form-section">
              <h2 className="form-section__title">Evaluations</h2>
              <div className="evaluations-grid">
                <div className="evaluation-item">
                  <label>Dimensional Evaluation*</label>
                  <div className="radio-group radio-group--horizontal">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="dimensionalEval"
                        value="approved"
                        checked={dimensionalEval === 'approved'}
                        onChange={(e) => setDimensionalEval(e.target.value as any)}
                      />
                      <span>Approved</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="dimensionalEval"
                        value="rejected"
                        checked={dimensionalEval === 'rejected'}
                        onChange={(e) => setDimensionalEval(e.target.value as any)}
                      />
                      <span>Rejected</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="dimensionalEval"
                        value="rework"
                        checked={dimensionalEval === 'rework'}
                        onChange={(e) => setDimensionalEval(e.target.value as any)}
                      />
                      <span>Rework Needed</span>
                    </label>
                  </div>
                </div>

                <div className="evaluation-item">
                  <label>Visual Evaluation*</label>
                  <div className="radio-group radio-group--horizontal">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="visualEval"
                        value="approved"
                        checked={visualEval === 'approved'}
                        onChange={(e) => setVisualEval(e.target.value as any)}
                      />
                      <span>Approved</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="visualEval"
                        value="rejected"
                        checked={visualEval === 'rejected'}
                        onChange={(e) => setVisualEval(e.target.value as any)}
                      />
                      <span>Rejected</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="visualEval"
                        value="rework"
                        checked={visualEval === 'rework'}
                        onChange={(e) => setVisualEval(e.target.value as any)}
                      />
                      <span>Rework Needed</span>
                    </label>
                  </div>
                </div>

                <div className="evaluation-item">
                  <label>Packaging and Overall Evaluation*</label>
                  <div className="radio-group radio-group--horizontal">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="packagingEval"
                        value="approved"
                        checked={packagingEval === 'approved'}
                        onChange={(e) => setPackagingEval(e.target.value as any)}
                      />
                      <span>Approved</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="packagingEval"
                        value="rejected"
                        checked={packagingEval === 'rejected'}
                        onChange={(e) => setPackagingEval(e.target.value as any)}
                      />
                      <span>Rejected</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="packagingEval"
                        value="rework"
                        checked={packagingEval === 'rework'}
                        onChange={(e) => setPackagingEval(e.target.value as any)}
                      />
                      <span>Rework Needed</span>
                    </label>
                  </div>
                </div>

                <div className="evaluation-item">
                  <label>Lot Treatment*</label>
                  <div className="radio-group radio-group--horizontal">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="lotTreatment"
                        value="approved"
                        checked={lotTreatment === 'approved'}
                        onChange={(e) => setLotTreatment(e.target.value as any)}
                      />
                      <span>Approved</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="lotTreatment"
                        value="rejected"
                        checked={lotTreatment === 'rejected'}
                        onChange={(e) => setLotTreatment(e.target.value as any)}
                      />
                      <span>Rejected</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="lotTreatment"
                        value="rework"
                        checked={lotTreatment === 'rework'}
                        onChange={(e) => setLotTreatment(e.target.value as any)}
                      />
                      <span>Rework Needed</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Defects */}
            <section className="form-section">
              <h2 className="form-section__title">Defects</h2>
              <div className="defects-table">
                <div className="defects-table__header">
                  <div>Defect</div>
                  <div>Description</div>
                  <div>Qty</div>
                </div>
                <div className="defects-table__body">
                  {defects.map((defect, index) => (
                    <div key={index} className="defects-table__row">
                      <div className="defects-table__cell">{defect.name}</div>
                      <div className="defects-table__cell">
                        <input
                          type="text"
                          value={defect.description}
                          onChange={(e) => handleDefectChange(index, 'description', e.target.value)}
                          placeholder="Optional description"
                        />
                      </div>
                      <div className="defects-table__cell">
                        <input
                          type="number"
                          min="0"
                          value={defect.qty}
                          onChange={(e) => handleDefectChange(index, 'qty', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Dimensional Records */}
            <section className="form-section">
              <h2 className="form-section__title">Dimensional Records</h2>
              
              {/* Dimensional Measurements */}
              <div className="dimensional-records">
                {/* Length */}
                <div className="dimensional-category">
                  <div className="dimensional-category__header">
                    <label>Length</label>
                    <div className="dimensional-unit">
                      <label>Unit:</label>
                      <input
                        type="text"
                        value={lengthUnit}
                        onChange={(e) => setLengthUnit(e.target.value)}
                        placeholder="mm"
                        className="unit-input"
                      />
                    </div>
                  </div>
                  <div className="dimensional-items">
                    {lengthRecords.map((val, i) => (
                      <div key={i} className="dimensional-item">
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => updateDimensionalRecord(lengthRecords, setLengthRecords, i, e.target.value)}
                          placeholder="Dimensions"
                        />
                        {lengthRecords.length > 1 && (
                          <button
                            type="button"
                            className="dimensional-remove"
                            onClick={() => removeDimensionalRecord(lengthRecords, setLengthRecords, i)}
                          >
                            <HiX />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="dimensional-add"
                      onClick={() => addDimensionalRecord(lengthRecords, setLengthRecords)}
                    >
                      <HiPlus /> Add Dimension
                    </button>
                  </div>
                </div>

                {/* Width */}
                <div className="dimensional-category">
                  <div className="dimensional-category__header">
                    <label>Width</label>
                    <div className="dimensional-unit">
                      <label>Unit:</label>
                      <input
                        type="text"
                        value={widthUnit}
                        onChange={(e) => setWidthUnit(e.target.value)}
                        placeholder="mm"
                        className="unit-input"
                      />
                    </div>
                  </div>
                  <div className="dimensional-items">
                    {widthRecords.map((val, i) => (
                      <div key={i} className="dimensional-item">
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => updateDimensionalRecord(widthRecords, setWidthRecords, i, e.target.value)}
                          placeholder="Dimensions"
                        />
                        {widthRecords.length > 1 && (
                          <button
                            type="button"
                            className="dimensional-remove"
                            onClick={() => removeDimensionalRecord(widthRecords, setWidthRecords, i)}
                          >
                            <HiX />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="dimensional-add"
                      onClick={() => addDimensionalRecord(widthRecords, setWidthRecords)}
                    >
                      <HiPlus /> Add Dimension
                    </button>
                  </div>
                </div>

                {/* Thickness */}
                <div className="dimensional-category">
                  <div className="dimensional-category__header">
                    <label>Thickness</label>
                    <div className="dimensional-unit">
                      <label>Unit:</label>
                      <input
                        type="text"
                        value={thicknessUnit}
                        onChange={(e) => setThicknessUnit(e.target.value)}
                        placeholder="mm"
                        className="unit-input"
                      />
                    </div>
                  </div>
                  <div className="dimensional-items">
                    {thicknessRecords.map((val, i) => (
                      <div key={i} className="dimensional-item">
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => updateDimensionalRecord(thicknessRecords, setThicknessRecords, i, e.target.value)}
                          placeholder="Dimensions"
                        />
                        {thicknessRecords.length > 1 && (
                          <button
                            type="button"
                            className="dimensional-remove"
                            onClick={() => removeDimensionalRecord(thicknessRecords, setThicknessRecords, i)}
                          >
                            <HiX />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="dimensional-add"
                      onClick={() => addDimensionalRecord(thicknessRecords, setThicknessRecords)}
                    >
                      <HiPlus /> Add Dimension
                    </button>
                  </div>
                </div>

                {/* Squareness */}
                <div className="dimensional-category">
                  <div className="dimensional-category__header">
                    <label>Squareness</label>
                    <div className="dimensional-unit">
                      <label>Unit:</label>
                      <input
                        type="text"
                        value={squarenessUnit}
                        onChange={(e) => setSquarenessUnit(e.target.value)}
                        placeholder="mm"
                        className="unit-input"
                      />
                    </div>
                  </div>
                  <div className="dimensional-items">
                    {squarenessRecords.map((val, i) => (
                      <div key={i} className="dimensional-item">
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => updateDimensionalRecord(squarenessRecords, setSquarenessRecords, i, e.target.value)}
                          placeholder="Dimensions"
                        />
                        {squarenessRecords.length > 1 && (
                          <button
                            type="button"
                            className="dimensional-remove"
                            onClick={() => removeDimensionalRecord(squarenessRecords, setSquarenessRecords, i)}
                          >
                            <HiX />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="dimensional-add"
                      onClick={() => addDimensionalRecord(squarenessRecords, setSquarenessRecords)}
                    >
                      <HiPlus /> Add Dimension
                    </button>
                  </div>
                </div>
              </div>

              {/* Dimensional Records Images */}
              <div className="images-subsection">
                <h3 className="images-subsection__title">Dimensional Records Images</h3>
                <div className="images-container">
                  {renderImageUploadSection('Length Images (4 required)', lengthImages, setLengthImages, 4)}
                  {renderImageUploadSection('Width Images (4 required)', widthImages, setWidthImages, 4)}
                  {renderImageUploadSection('Thickness Images (4 required)', thicknessImages, setThicknessImages, 4)}
                  {renderImageUploadSection('Square Images (4 required)', squareImages, setSquareImages, 4)}
                </div>
              </div>
            </section>

            {/* Surface Visual Aspects */}
            <section className="form-section">
              <h2 className="form-section__title">Surface Visual Aspects</h2>
              <div className="images-container">
                {renderImageUploadSection('Face Images (8 required)', faceImages, setFaceImages, 8)}
                {renderImageUploadSection('Back Face Images (8 required)', backFaceImages, setBackFaceImages, 8)}
              </div>
            </section>

            {/* Packing and Overall Aspects */}
            <section className="form-section">
              <h2 className="form-section__title">Packing and Overall Aspects</h2>
              <div className="images-container">
                {renderImageUploadSection('Palette Images (2-3)', paletteImages, setPaletteImages, 3)}
                {renderImageUploadSection('Paint Images (2-3)', paintImages, setPaintImages, 3)}
                {renderImageUploadSection('Construction Defect Images (4-6)', constructionDefectImages, setConstructionDefectImages, 6)}
                {renderImageUploadSection('Stamp Images (2-3)', stampImages, setStampImages, 3)}
                {renderImageUploadSection('Edge Images (4-6)', edgeImages, setEdgeImages, 6)}
                {renderImageUploadSection('Height/Support Images (2-4)', heightImages, setHeightImages, 4)}
              </div>
            </section>

            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                size="large"
                onClick={() => navigate('/auditoria')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="large"
                icon={<HiSave />}
                iconPosition="left"
                loading={loading}
              >
                Save Report
              </Button>
            </div>
          </form>
        )}
        </main>
      </div>
    </div>
  );
}
