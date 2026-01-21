import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import IndicatorSourceSelector, {
  IndicatorSourceData,
} from "../../ui/indicator-source-selector";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import DisaggregationComponent from "@/ui/disaggregation-component";
import DateInput from "@/ui/form/date-input";
import TextareaInput from "@/ui/form/textarea";
import RadioInput from "@/ui/form/radio";
import TagInput from "@/ui/form/tag-input";
import Button from "@/ui/form/button";
import { indicatorApi } from "@/lib/api/indicatorApi";
import { IndicatorFormData } from "@/types/indicator";
import { fetchResultTypes, transformResultTypesToOptions, ResultType } from "@/lib/api/result-types";
import toast from "react-hot-toast";

export default function AddIndicatorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [resultTypes, setResultTypes] = useState<ResultType[]>([]);
  const [resultTypeOptions, setResultTypeOptions] = useState<Array<{ label: string; value: string }>>([]);
  
  const [formData, setFormData] = useState<IndicatorFormData>({
    indicatorId: "",
    indicatorSource: "",
    thematicAreasOrPillar: "",
    statement: "",
    linkKpiToSdnOrgKpi: "",
    definition: "",
    specificArea: "",
    unitOfMeasure: "",
    itemInMeasure: "",
    disaggregationId: "",
    baseLineDate: "",
    cumulativeValue: "",
    baselineNarrative: "",
    targetDate: "",
    cumulativeTarget: "",
    targetNarrative: "",
    targetType: "cumulative",
    responsiblePersons: [],
    result: "",
    resultTypeId: "",
  });

  // Fetch result types on component mount
  useEffect(() => {
    const loadResultTypes = async () => {
      setIsLoadingResults(true);
      try {
        const results = await fetchResultTypes();
        setResultTypes(results);
        
        // Transform to dropdown options
        const options = transformResultTypesToOptions(results);
        setResultTypeOptions(options);
        
        // Optionally preselect the first result type if none is selected
        if (results.length > 0 && !formData.resultTypeId) {
          setFormData(prev => ({
            ...prev,
            result: results[0].resultName,
            resultTypeId: results[0].resultTypeId,
          }));
        }
      } catch (error) {
        console.error("Failed to load result types:", error);
      } finally {
        setIsLoadingResults(false);
      }
    };

    loadResultTypes();
  }, []);

  // Handle indicator source change
  const handleIndicatorSourceChange = (data: IndicatorSourceData) => {
  console.log("Indicator source data received:", data);
  
  setFormData(prev => ({
    ...prev,
    indicatorSource: data.indicatorSource,
    thematicAreasOrPillar: data.thematicAreasOrPillar,
    statement: data.statement,
  }));
};

  // Handle general form field changes
  const handleInputChange = (field: keyof IndicatorFormData, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle dropdown changes
  const handleDropdownChange = (field: keyof IndicatorFormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle result type selection
  const handleResultTypeChange = (resultTypeId: string) => {
    // Find the selected result type
    const selectedResultType = resultTypes.find(type => type.resultTypeId === resultTypeId);
    
    if (selectedResultType) {
      setFormData(prev => ({
        ...prev,
        result: selectedResultType.resultName,
        resultTypeId: selectedResultType.resultTypeId,
      }));
    }
  };

  // Handle disaggregation change
  const handleDisaggregationChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      disaggregationId: id,
    }));
  };

  // Prepare payload for API
  const preparePayload = () => {
    // Convert string values to numbers for cumulative fields
    const cumulativeValue = parseFloat(formData.cumulativeValue as string) || 0;
    const cumulativeTarget = parseFloat(formData.cumulativeTarget as string) || 0;
    
    // Format dates to ISO string
    const baseLineDate = formData.baseLineDate 
      ? new Date(formData.baseLineDate).toISOString() 
      : "";
    
    const targetDate = formData.targetDate 
      ? new Date(formData.targetDate).toISOString() 
      : "";
    
    const payload = {
      isCreate: true,
      data: {
        indicatorId: formData.indicatorId,
        indicatorSource: formData.indicatorSource,
        thematicAreasOrPillar: formData.thematicAreasOrPillar,
        statement: formData.statement,
        linkKpiToSdnOrgKpi: formData.linkKpiToSdnOrgKpi,
        definition: formData.definition,
        specificArea: formData.specificArea,
        unitOfMeasure: formData.unitOfMeasure,
        itemInMeasure: formData.itemInMeasure,
        disaggregationId: "88hg-9987-iu67",
        baseLineDate: baseLineDate,
        cumulativeValue: cumulativeValue,
        baselineNarrative: formData.baselineNarrative,
        targetDate: targetDate,
        cumulativeTarget: cumulativeTarget,
        targetNarrative: formData.targetNarrative,
        targetType: formData.targetType,
        responsiblePersons: formData.responsiblePersons.join(", "),
        result: formData.result,
        resultTypeId: formData.resultTypeId,
      },
    };
    
    return payload;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.resultTypeId) {
        toast.error("Please select a result type");
        setIsSubmitting(false);
        return;
      }

      const payload = preparePayload();
      console.log("Submitting payload:", payload);
      
      const response = await indicatorApi.createIndicator(payload);
      console.log("Indicator created successfully:", response);
      
      // Reset form or show success message
      toast.success("Indicator added successfully!");
      
      // Reset form (but keep result types loaded)
      setFormData({
        indicatorId: "",
        indicatorSource: "",
        thematicAreasOrPillar: "",
        statement: "",
        linkKpiToSdnOrgKpi: "",
        definition: "",
        specificArea: "",
        unitOfMeasure: "",
        itemInMeasure: "",
        disaggregationId: "",
        baseLineDate: "",
        cumulativeValue: "",
        baselineNarrative: "",
        targetDate: "",
        cumulativeTarget: "",
        targetNarrative: "",
        targetType: "cumulative",
        responsiblePersons: [],
        result: resultTypes.length > 0 ? resultTypes[0].resultName : "",
        resultTypeId: resultTypes.length > 0 ? resultTypes[0].resultTypeId : "",
      });
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add indicator. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      // Reset form but keep the first result type selected if available
      setFormData({
        indicatorId: "",
        indicatorSource: "",
        thematicAreasOrPillar: "",
        statement: "",
        linkKpiToSdnOrgKpi: "",
        definition: "",
        specificArea: "",
        unitOfMeasure: "",
        itemInMeasure: "",
        disaggregationId: "",
        baseLineDate: "",
        cumulativeValue: "",
        baselineNarrative: "",
        targetDate: "",
        cumulativeTarget: "",
        targetNarrative: "",
        targetType: "cumulative",
        responsiblePersons: [],
        result: resultTypes.length > 0 ? resultTypes[0].resultName : "",
        resultTypeId: resultTypes.length > 0 ? resultTypes[0].resultTypeId : "",
      });
      console.log("Form cancelled");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 my-8 max-w-4xl mx-auto p-6">
      {/* indicator source */}
      <IndicatorSourceSelector
        onChange={handleIndicatorSourceChange}
        thematicAreaOptions={[]}
      />

      {/* result type dropdown - ADDED */}
      <div className="space-y-1">
        <DropDown
          label="Result Type"
          value={formData.resultTypeId}
          name="resultTypeId"
          placeholder={isLoadingResults ? "Loading result types..." : "Select a result type"}
          onChange={handleResultTypeChange}
          options={resultTypeOptions}
          isBigger
        />
        {formData.result && (
          <p className="text-sm text-gray-500 mt-1">
            Selected: {formData.result}
          </p>
        )}
      </div>

      {/* link to indicator sdn */}
      <DropDown
        label="Link Indicator to SDN Org KPIs (Optional)"
        value={formData.linkKpiToSdnOrgKpi}
        name="linkKpiToSdnOrgKpi"
        placeholder="---"
        onChange={handleDropdownChange('linkKpiToSdnOrgKpi')}
        options={[
          {label: "KPI-001", value: "KPI-001"}
        ]}
        isBigger
      />

      {/* indicator definition */}
      <TextInput
        label="Indicator Definition (Optional)"
        value={formData.definition}
        name="definition"
        placeholder="---"
        onChange={(e) => handleInputChange('definition', e.target.value)}
        isBigger
      />

      {/* specific area */}
      <TextInput
        label="Specific Area"
        value={formData.specificArea}
        name="specificArea"
        placeholder="---"
        onChange={(e) => handleInputChange("specificArea", e.target.value)}
        isBigger
      />

      {/* unit of measurement */}
      <DropDown
        label="Unit of Measurement"
        value={formData.unitOfMeasure}
        name="unitOfMeasure"
        placeholder="---"
        onChange={handleDropdownChange('unitOfMeasure')}
        options={[
          {label: "Percentage", value: "Percentage"}
        ]}
        isBigger
      />

      {/* items in measurement */}
      <TextInput
        label="Items in Measurement"
        value={formData.itemInMeasure}
        name="itemInMeasure"
        placeholder="---"
        onChange={(e) => handleInputChange('itemInMeasure', e.target.value)}
        isBigger
      />

      {/* checkboxes */}
      <DisaggregationComponent
        onChange={handleDisaggregationChange}
      />

      {/* baseline */}
      <div className="space-y-1 rounded-lg">
        <p className="text-gray-900 text-sm font-medium mb-3">Baseline</p>
        
        {/* baseline date */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium w-1/3">Baseline Date</p>
          <div className="w-2/3">
            <DateInput
              value={formData.baseLineDate}
              onChange={(value) => handleInputChange('baseLineDate', value)}
            />
          </div>
        </div>
        
        {/* cumulative value */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium w-1/3">Cumulative Value</p>
          <div className="w-2/3">
            <TextInput
              placeholder="200"
              value={formData.cumulativeValue}
              name="cumulativeValue"
              onChange={(e) => handleInputChange('cumulativeValue', e.target.value)}
            />
          </div>
        </div>
        
        {/* baseline narrative */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium w-1/3">Baseline Narrative</p>
          <div className="w-2/3">
            <TextareaInput
              placeholder="---"
              value={formData.baselineNarrative}
              name="baselineNarrative"
              onChange={(e) => handleInputChange('baselineNarrative', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* target section */}
      <div className="space-y-1 rounded-lg">
        <p className="text-gray-900 text-sm font-medium mb-3">Target</p>
        
        {/* target date */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium w-1/3">Target Date</p>
          <div className="w-2/3">
            <DateInput
              value={formData.targetDate}
              onChange={(value) => handleInputChange('targetDate', value)}
            />
          </div>
        </div>
        
        {/* cumulative target */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium w-1/3">Cumulative Target</p>
          <div className="w-2/3">
            <TextInput
              placeholder="200"
              value={formData.cumulativeTarget}
              name="cumulativeTarget"
              onChange={(e) => handleInputChange('cumulativeTarget', e.target.value)}
            />
          </div>
        </div>
        
        {/* target narrative */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium w-1/3">Target Narrative</p>
          <div className="w-2/3">
            <TextareaInput
              placeholder="---"
              value={formData.targetNarrative}
              name="targetNarrative"
              onChange={(e) => handleInputChange('targetNarrative', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* target type */}
      <div className="space-y-1">
        <p className="text-[#101928] text-sm font-medium">Target Type</p>
        <div className="flex items-center gap-2">
          <RadioInput
            label="Cumulative"
            value="cumulative"
            name="targetType"
            is_checked={formData.targetType === "cumulative"}
            onChange={() => handleInputChange('targetType', 'cumulative')}
          />
          <RadioInput
            label="Periodic"
            value="periodic"
            name="targetType"
            is_checked={formData.targetType === "periodic"}
            onChange={() => handleInputChange('targetType', 'periodic')}
          />
        </div>
      </div>

      <TagInput
        label="Responsible Person(s)"
        value={formData.responsiblePersons}
        onChange={(persons) => handleInputChange('responsiblePersons', persons)}
      />

      {/* buttons */}
      <div className="flex items-center gap-8 pt-4">
        <Button
          type="button"
          content="Cancel"
          isSecondary
          onClick={handleCancel}
          isDisabled={isSubmitting || isLoadingResults}
        />
        <Button
          type="submit"
          content={isSubmitting ? "Adding..." : "Add"}
          isDisabled={isSubmitting || isLoadingResults || !formData.resultTypeId}
        />
      </div>

      {/* Loading state indicator */}
      {isLoadingResults && (
        <div className="text-center text-gray-500 text-sm">
          Loading result types...
        </div>
      )}
    </form>
  );
}