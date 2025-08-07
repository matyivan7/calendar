import React, {useCallback, useEffect, useState} from 'react';
import {Calendar, dateFnsLocalizer, Views} from 'react-big-calendar';
import {format, getDay, parse, startOfWeek} from 'date-fns';
import {useNavigate} from 'react-router-dom';
import {hu} from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar-styles.css';
import {createAppointment, getAllAppointments, updateAppointment} from "../api/auth.js";


const serviceTypes = [
    'GEL_LAKKOZAS',
    'TOLTES',
    'MUKOROM_EPITES',
    'LAKK_LESZEDES',
    'MANIKUR',
];

const locales = {
    'hu': hu,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), {weekStartsOn: 1}),
    getDay,
    locales,
    locale: hu
});


export default function MyCalendar() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [clickTimeout, setClickTimeout] = useState(null);
    const [currentView, setCurrentView] = useState(Views.WEEK);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        clientName: '',
        serviceType: serviceTypes[0],
        startTime: '',
        endTime: '',
        phoneNumber: '',
        notes: '',
    });


    useEffect(() => {
        async function fetchAppointments() {
            try {
                const data = await getAllAppointments();
                const parseEvents = data.map(appt => ({
                    id: appt.id,
                    title: appt.clientName,
                    start: new Date(appt.startTime),
                    end: new Date(appt.endTime),
                    phoneNumber: appt.phoneNumber,
                    notes: appt.notes,
                    serviceType: appt.serviceType,
                }));
                setEvents(parseEvents)
            } catch (error) {
                console.error("Failed to load all appointments", error)
            }
        }
        fetchAppointments()
    }, []);

    React.useEffect(() => {
        return () => {
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }
        };
    }, [clickTimeout]);

    const handleSelectSlot = useCallback((slotInfo) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);

            setFormData({
                clientName: '',
                serviceType: serviceTypes[0],
                startTime: slotInfo.start.toISOString(),
                endTime: slotInfo.end.toISOString(),
                phoneNumber: '',
                notes: '',
            });
            setShowModal(true);
        } else {
            const timeout = setTimeout(() => {
                setClickTimeout(null);
            }, 300);

            setClickTimeout(timeout);
        }
    }, [clickTimeout]);

    const handleDoubleClickEvent = useCallback((event) => {
        setIsEditMode(true);
        setEditingEventId(event.id);
        setFormData({
            id: event.id,
            clientName: event.title,
            serviceType: event.serviceType || serviceTypes[0],
            startTime: event.start.toISOString(),
            endTime: event.end.toISOString(),
            phoneNumber: event.phoneNumber || '',
            notes: event.notes || '',
        });
        setShowModal(true);
    }, []);

    const handleChange = useCallback((e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));

        if (name === "phoneNumber") {
            const phoneRegex = /^[0-9]{7,15}$/;
            if (value && !phoneRegex.test(value)) {
                setErrors(prev => ({
                    ...prev,
                    phoneNumber: "Érvénytelen telefonszám. Csak számokat használj (min. 7 karakter)."
                }));
            } else {
                setErrors(prev => {
                    const newErrors = {...prev};
                    delete newErrors.phoneNumber;
                    return newErrors;
                });
            }
        }
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const start = new Date(formData.startTime);
        const end = new Date(formData.endTime);

        if (end <= start) {
            alert("A befejezés nem lehet korábbi vagy egyenlő a kezdésnél.");
            return;
        }

        if (!/^\d{7,15}$/.test(formData.phoneNumber)) {
            alert("A telefonszám csak számokat tartalmazhat (minimum 7 számjegy).");
            return;
        }

        if (!formData.clientName.trim()) {
            alert("A név megadása kötelező.");
            return;
        }
        try {
            if (isEditMode) {
                const updatedAppt = await updateAppointment(formData);
                setEvents(prev => prev.map(event =>
                    event.id === editingEventId
                        ? {
                            title: updatedAppt.clientName,
                            start: new Date(updatedAppt.startTime),
                            end: new Date(updatedAppt.endTime),
                            phoneNumber: updatedAppt.phoneNumber,
                            notes: updatedAppt.notes,
                            serviceType: updatedAppt.serviceType,
                        }
                        : event
                ));
            } else {
                const newAppt = await createAppointment(formData);
                setEvents(prev => [...prev, {
                    id: newAppt.id,
                    title: newAppt.clientName,
                    start: new Date(newAppt.startTime),
                    end: new Date(newAppt.endTime),
                    phoneNumber: newAppt.phoneNumber,
                    notes: newAppt.notes,
                    serviceType: newAppt.serviceType,
                }]);
            }
            setShowModal(false);
            setIsEditMode(false);
            setEditingEventId(null);
        } catch (err) {
            console.error('Error saving appointment', err);
            alert('Failed to save appointment.');
        }
    }, [formData, isEditMode, editingEventId]);

    const handleModalClose = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditingEventId(null);
    };

    const handleNavigate = (action) => {
        const date = new Date(currentDate);
        if (action === 'PREV') {
            if (currentView === Views.MONTH) {
                date.setMonth(date.getMonth() - 1);
            } else if (currentView === Views.WEEK) {
                date.setDate(date.getDate() - 7);
            } else if (currentView === Views.DAY) {
                date.setDate(date.getDate() - 1);
            }
        } else if (action === 'NEXT') {
            if (currentView === Views.MONTH) {
                date.setMonth(date.getMonth() + 1);
            } else if (currentView === Views.WEEK) {
                date.setDate(date.getDate() + 7);
            } else if (currentView === Views.DAY) {
                date.setDate(date.getDate() + 1);
            }
        } else if (action === 'TODAY') {
            setCurrentDate(new Date());
            return;
        }
        setCurrentDate(date);
    };

    const formatCurrentDate = () => {
        if (currentView === Views.MONTH) {
            return format(currentDate, 'yyyy MMMM', { locale: hu });
        } else if (currentView === Views.WEEK) {
            const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
        } else {
            return format(currentDate, 'yyyy MMMM d', { locale: hu });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const CustomToolbar = () => (
        <div className="custom-toolbar">
            <div className="toolbar-left">
                <button
                    className="nav-button"
                    onClick={() => handleNavigate('PREV')}
                    title="Előző"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
            </div>

            <div className="toolbar-center">
                <button
                    className="today-button"
                    onClick={() => handleNavigate('TODAY')}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Ma
                </button>
                <div className="current-date">
                    {formatCurrentDate()}
                </div>
            </div>

            <div className="toolbar-right">
                <button
                    className="nav-button"
                    onClick={() => handleNavigate('NEXT')}
                    title="Következő"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                </button>

                <div className="view-buttons">
                    <button
                        className={`view-button ${currentView === Views.MONTH ? 'active' : ''}`}
                        onClick={() => setCurrentView(Views.MONTH)}
                    >
                        Hónap
                    </button>
                    <button
                        className={`view-button ${currentView === Views.WEEK ? 'active' : ''}`}
                        onClick={() => setCurrentView(Views.WEEK)}
                    >
                        Hét
                    </button>
                    <button
                        className={`view-button ${currentView === Views.DAY ? 'active' : ''}`}
                        onClick={() => setCurrentView(Views.DAY)}
                    >
                        Nap
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center">
                        <div
                            className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mr-3">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-light text-gray-900">Nail Studio - Naptár</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-light text-gray-900 mb-2">Időpontok kezelése</h2>
                            <p className="text-gray-600 text-sm">Dupla kattintással új időpontot hozhat létre</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            Kijelentkezés
                        </button>
                    </div>

                    <CustomToolbar/>

                    <div style={{height: 'calc(100vh - 350px)'}} className="calendar-container">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            culture="hu"
                            selectable
                            resizable
                            views={[Views.MONTH, Views.WEEK, Views.DAY]}
                            view={currentView}
                            date={currentDate}
                            onView={setCurrentView}
                            onNavigate={setCurrentDate}
                            onSelectSlot={handleSelectSlot}
                            onDoubleClickEvent={handleDoubleClickEvent}
                            popup
                            style={{height: '100%'}}
                            toolbar={false}
                            eventPropGetter={(event) => ({
                                style: {
                                    backgroundColor: '#ec4899',
                                    borderColor: '#be185d',
                                    color: 'white',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '13px',
                                    padding: '2px 6px'
                                }
                            })}
                        />
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mr-3">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 4v16m8-8H4"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-light text-gray-900">Új időpont</h3>
                                </div>
                                <button
                                    onClick={handleModalClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ügyfél neve
                                    </label>
                                    <input
                                        name="clientName"
                                        type="text"
                                        value={formData.clientName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="Adja meg az ügyfél nevét"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Szolgáltatás típusa
                                    </label>
                                    <select
                                        name="serviceType"
                                        value={formData.serviceType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                    >
                                        {serviceTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type.replace(/_/g, ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kezdés
                                        </label>
                                        <input
                                            name="startTime"
                                            type="datetime-local"
                                            value={formData.startTime instanceof Date ? formData.startTime.toISOString().slice(0, 16) : formData.startTime?.slice(0, 16)}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Befejezés
                                        </label>
                                        <input
                                            name="endTime"
                                            type="datetime-local"
                                            value={formData.endTime instanceof Date ? formData.endTime.toISOString().slice(0, 16) : formData.endTime?.slice(0, 16)}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefonszám
                                    </label>
                                    <input
                                        name="phoneNumber"
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white
                                                    ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Telefonszám (opcionális)"
                                    />
                                    {errors.phoneNumber && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Megjegyzések
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                                        placeholder="További megjegyzések (opcionális)"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleModalClose}
                                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                    >
                                        Mégse
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                                    >
                                        {isEditMode ? 'Módosítás' : 'Létrehozás'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}