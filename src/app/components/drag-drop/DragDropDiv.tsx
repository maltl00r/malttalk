"use client";
import { useState, useMemo, useEffect } from "react";
import { 
  DndContext, PointerSensor, useSensor, useSensors, 
  useDroppable, rectIntersection 
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { tablaDragDropContent } from "@/data/lessons";

// 1. Componente de seguridad para evitar Hydration Mismatch
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  if (!hasMounted) return null;
  return <>{children}</>;
}

export default function DragDropDiv({ lessonId }: { lessonId: number }) {
  const baseItems = useMemo(() => {
    return tablaDragDropContent.filter((i) => i.lesson_id === lessonId);
  }, [lessonId]);

  const categories = useMemo(() => Array.from(new Set(baseItems.map((i) => i.category))), [baseItems]);

  const [pool, setPool] = useState(baseItems);
  const [bins, setBins] = useState<Record<string, any[]>>(() =>
    categories.reduce((acc, cat) => ({ ...acc, [cat]: [] }), {})
  );

  // 2. Shuffle seguro ejecutado solo en el cliente tras el montaje
  useEffect(() => {
    setPool([...baseItems].sort(() => Math.random() - 0.5));
  }, [baseItems]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const itemId = Number(active.id);
    let targetId = over.id;
    
    if (!categories.includes(targetId)) {
      const container = Object.keys(bins).find(cat => 
        bins[cat].find(i => i.id.toString() === targetId.toString())
      );
      if (container) targetId = container;
    }

    const allItems = [...pool, ...Object.values(bins).flat()];
    const movedItem = allItems.find(i => i.id === itemId);
    if (!movedItem) return;

    setPool(prev => prev.filter(i => i.id !== itemId));
    setBins(prev => {
      const newBins = { ...prev };
      Object.keys(newBins).forEach(cat => {
        newBins[cat] = newBins[cat].filter(i => i.id !== itemId);
      });
      return newBins;
    });

    if (categories.includes(targetId)) {
      setBins(prev => ({ ...prev, [targetId]: [...(prev[targetId] || []), movedItem] }));
    } else {
      setPool(prev => [...prev, movedItem]);
    }
  };

  const isComplete = pool.length === 0 && Object.values(bins).flat().length === baseItems.length;
  const isAllCorrect = Object.entries(bins).every(([cat, items]) => items.every(i => i.category === cat));

  return (
    <ClientOnly>
      <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-8 p-6 bg-slate-950 rounded-xl">
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <DroppableBox key={cat} id={cat} title={cat} items={bins[cat]} />
            ))}
          </div>

          <div className="p-4 bg-slate-800 rounded-lg min-h-[80px] border border-slate-700">
            <h4 className="text-slate-400 text-sm mb-2 uppercase">Vocabulario disponible</h4>
            <div className="flex flex-wrap gap-2">
              {pool.map((item) => <DraggableItem key={item.id} item={item} />)}
            </div>
          </div>

          {isComplete && (
            <div className={`p-4 rounded text-center font-bold ${isAllCorrect ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
              {isAllCorrect ? "¡Excelente trabajo! Todo clasificado correctamente." : "Revisa la clasificación, hay errores."}
            </div>
          )}
        </div>
      </DndContext>
    </ClientOnly>
  );
}

function DroppableBox({ id, title, items }: { id: string, title: string, items: any[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`min-h-[250px] p-4 rounded-lg border-2 transition-colors flex flex-col ${isOver ? 'border-blue-500 bg-slate-900/50' : 'border-slate-700 bg-slate-900'}`}>
      <h3 className="text-white font-bold mb-4 capitalize border-b border-slate-700 pb-2">{title}</h3>
      <div className="w-full h-full flex-1"> 
        <SortableContext items={items.map(i => i.id.toString())} strategy={verticalListSortingStrategy}>
          {items.map(item => <DraggableItem key={item.id} item={item} currentCategory={id} />)}
        </SortableContext>
      </div>
    </div>
  );
}

function DraggableItem({ item, currentCategory }: { item: any, currentCategory?: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id.toString() });
  const style = { transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 100 : 'auto', opacity: isDragging ? 0.5 : 1 };
  const isWrong = currentCategory && item.category !== currentCategory;

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={`group relative p-3 mb-2 rounded text-white cursor-grab shadow touch-none select-none ${isWrong ? "bg-red-700/80" : "bg-blue-700/80"} ${isDragging ? "ring-2 ring-white" : ""}`}>
      {item.text}
      {isWrong && item.feedback_message_wrong && (
        <div className="absolute top-2 right-2 cursor-help">
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white text-red-600 font-bold text-[10px]">i</span>
          <div className="absolute right-0 top-6 w-64 p-3 bg-black text-white text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] border border-slate-700">
            {item.feedback_message_wrong}
          </div>
        </div>
      )}
    </div>
  );
}